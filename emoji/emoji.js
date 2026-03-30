const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const path = require('path');
const ollama = require('ollama').default || require('ollama');

const PORT = 3008; // Отдельный порт для чата, чтобы не конфликтовать с логами игры

module.exports = {
    init: function() {
        app.get('/chat', (req, res) => {
            res.sendFile(path.join(__dirname, 'emoji.html'));
        });

        app.use(express.json()); // Чтобы express понимал JSON в теле запроса
        app.post('/test-msg', async (req, res) => {
            const { user, msg, color } = req.body;
            //console.log(`[Test-Input] Получено через curl: ${user}: ${msg}`);
            
            // Вызываем твою основную логику
            await this.handleNewMessage(user || 'Tester', msg || 'Hello!', color || '#00FFCC');
            
            res.send({ status: 'sent_to_ai' });
        });

        http.listen(PORT, () => {
            console.log('\x1b[32m%s\x1b[0m', `[Emoji-Chat] Виджет запущен: http://localhost:${PORT}/chat`);
        });
    },

    handleNewMessage: async function(username, message, userColor) {
        try {
            const currentGames = "REPO (horror, co-op), Last Epoch (ARPG)";

            const isSentByTekken  = username.toLowerCase() === "tekkenking64";

            // Промпт в стиле "Заверши фразу" — это заставляет модель не болтать
            const prompt = `### System:
            Ты — креативный ИИ-режиссер эмоций для Twitch-стрима. 
            ТВОЯ ЦЕЛЬ: Выбирать максимально точные, редкие и визуально интересные эмодзи. 

            ПРАВИЛА ИГРЫ:
            1. НИКОГДА не ограничивайся стандартным набором (📈, 😏, 📊). Ищи глубокий смысл.
            2. Твой стиль — эффективность, расчет + азарт геймера.
            3. БЕЗОПАСНОСТЬ: Соблюдай правила Twitch. Никакой ненависти или оскорблений.
            4. ПЕРСОНАЛИЗАЦИЯ: ${isSentByTekken ? '🤡 разрешен' : '🤡 строго запрещен.'}

            ИНСТРУКЦИЯ ПО ВЫБОРУ:
            - Если сообщение про БИЛДЫ/ДЕНЬГИ: используй символы науки, инструментов, богатства или прогресса.
            - Если сообщение про СТРАХ/ОПАСНОСТЬ (REPO): используй символы ночи, мистики, анатомии или механизмов.
            - Если в чате ИРОНИЯ: используй абсурдные, театральные или странные символы.
            - Если сообщение ОБЫЧНОЕ: найди в нем скрытый подтекст и подсвети его.

            Контекст игр: ${currentGames}.
            Ответь только одним знаком, не пиши слов. Будь непредсказуемым.

            ### Task:
            User [${username}]: "${message}"
            Emoji:`;

            const startTime = Date.now();
            const response = await ollama.generate({
                model: 'llama3:8b',
                prompt: prompt,
                options: { 
                    num_predict: 10, 
                    temperature: 0.85,     // Вернем к 0.85 — это всё еще "весело", но уже стабильно
                    top_p: 0.9,
                    presence_penalty: 1.1,  // Снижаем: теперь она просто "предпочитает" новое
                    frequency_penalty: 1.1, // Снижаем: чтобы не ломать структуру Unicode
                    repeat_penalty: 1.1,
                    stop: ["\n", "User:"]
                }
            });

            const duration = Date.now() - startTime; // Время в мс
            let rawResponse = response.response.trim();
            const emojiRegex = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/u;
            const emojiMatch = rawResponse.match(emojiRegex);
            const emoji = emojiMatch ? emojiMatch[0] : '💬';

            // 3. Отправляем в оверлей
            const logColor = duration > 1000 ? '\x1b[33m' : '\x1b[32m'; // Желтый если долго, зеленый если быстро
            console.log(`${logColor}[AI-Chat] [${duration}ms] ${username}: ${message} -> ${emoji}\x1b[0m`);
            io.emit('chatMessage', {
                username: username,
                text: message,
                emoji: emoji,
                color: userColor || '#1E90FF' // Если цвета нет, ставим DodgerBlue
            });

        } catch (err) {
            console.error("[Emoji-Chat] Ошибка анализа:", err);
            // Если нейронка упала, шлем без эмодзи
            io.emit('chatMessage', { username, text: message, emoji: '💬' });
        }
    }
};