const { spawn } = require('child_process');
const WebSocket = require('ws');
const neuroOverlay = require('./neuroOverlay');
neuroOverlay.init();

// Настройки
const CONFIG = {
    pythonWsUrl: 'ws://127.0.0.1:3010/ws/analyze',
    sampleRate: 16000,
    silenceThreshold: 0.02, // Порог громкости (0.0 - 1.0)
    silenceDuration: 800,   // Сколько мс тишины ждать перед отправкой фразы
    micDevice: 'audio=Микрофон (fifine Microphone)'
};

let ws;
let ffmpegProcess = null; // Ссылка на процесс FFmpeg
let isManualStop = false; // Флаг, чтобы бот не перезапускал запись сам
let audioBuffer = [];
let isTalking = false;
let silenceTimer = null;

function connectToPython() {
    ws = new WebSocket(CONFIG.pythonWsUrl);
    
    ws.on('open', () => {
        console.log('--- [Neuro-Sync] Соединение с ИИ установлено ---');
        // Если запись не была остановлена вручную, включаем статус "активен"
        if (!isManualStop) {
            neuroOverlay.emit('aiStatus', { connected: true });
        }
    });

    ws.on('message', (data) => {
        try {
            const result = JSON.parse(data);
            console.log(`[data]: ${data}`);
            console.log(`[Эмоция]: ${result.top_emotion} (${(result.confidence * 100).toFixed(1)}%)`);
            neuroOverlay.emit('emotionUpdate', result);
        } catch (e) {
            console.error('Ошибка парсинга данных ИИ');
        }
    });

    ws.on('error', (err) => {
        console.error('[Neuro-Sync] Ошибка связи с ИИ');
        neuroOverlay.emit('aiStatus', { connected: false });
    });
    
    ws.on('close', () => {
        console.log('[Neuro-Sync] Соединение с ИИ закрыто. Переподключение...');
        setTimeout(connectToPython, 3000);
    });
}

function startRecording() {
    // Если запись уже идет, ничего не делаем
    if (ffmpegProcess) return;

    isManualStop = false;
    console.log('--- [Neuro-Sync] Запуск прослушивания... ---');

    ffmpegProcess = spawn('ffmpeg', [
        '-f', 'dshow', 
        '-i', CONFIG.micDevice,
        '-ar', CONFIG.sampleRate.toString(),
        '-ac', '1',
        '-f', 's16le',
        'pipe:1'
    ]);

    ffmpegProcess.stdout.on('data', (chunk) => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;

        const int16Array = new Int16Array(chunk.buffer, chunk.byteOffset, chunk.length / 2);
        let maxAmp = 0;
        for (let i = 0; i < int16Array.length; i++) {
            const amp = Math.abs(int16Array[i]) / 32768;
            if (amp > maxAmp) maxAmp = amp;
        }

        if (maxAmp > CONFIG.silenceThreshold) {
            if (!isTalking) {
                console.log('--- Речь обнаружена ---');
                isTalking = true;
            }
            audioBuffer.push(chunk);
            if (silenceTimer) clearTimeout(silenceTimer);
            silenceTimer = setTimeout(sendAudioToPython, CONFIG.silenceDuration);
        } else if (isTalking) {
            audioBuffer.push(chunk);
        }
    });

    ffmpegProcess.on('close', (code) => {
        console.log(`[Neuro-Sync] FFmpeg закрыт (код ${code})`);
        ffmpegProcess = null;
        // Перезапускаем только если не было команды на стоп
        if (!isManualStop) {
            console.log('[Neuro-Sync] Авто-перезапуск через 5 сек...');
            setTimeout(startRecording, 5000);
        }
    });

    // Сообщаем оверлею, что мы в сети
    neuroOverlay.emit('aiStatus', { connected: true });
}

function stopRecording() {
    isManualStop = true; // Блокируем авторестарт
    
    // Сбрасываем текущие таймеры и буферы
    if (silenceTimer) clearTimeout(silenceTimer);
    isTalking = false;
    audioBuffer = [];

    if (ffmpegProcess) {
        ffmpegProcess.kill();
        ffmpegProcess = null;
        console.log('--- [Neuro-Sync] Прослушивание остановлено вручную ---');
    }

    // Сообщаем оверлею, чтобы он "ушел в серый"
    neuroOverlay.emit('aiStatus', { connected: false });
}

function sendAudioToPython() {
    if (audioBuffer.length > 0) {
        const fullBuffer = Buffer.concat(audioBuffer);
        // Защита: фраза должна быть длиннее 0.5 сек
        if (fullBuffer.length > CONFIG.sampleRate * 1) { 
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(fullBuffer);
                console.log(`--- Фраза отправлена (${fullBuffer.length} байт) ---`);
            }
        }
        audioBuffer = [];
        isTalking = false;
    }
}

// Экспортируем функции, чтобы их увидел бот
module.exports = { startRecording, stopRecording };

// Запуск
connectToPython();
// Даем время сокету и запускаем по умолчанию
//setTimeout(startRecording, 1000);