// index.js
let { client } = require('./connection');
let { loadCommands } = require('./commands'); // Импорт загрузчика
let { commandWrapper } = require('./wrappers');
let config = require('./config');
let { initTerminal } = require('./terminal');
//let chat = require('./commands/chat');
const repoLogOverlay = require('./repoOverlays/repoLog');
const repoСooldownOverlay = require('./repoOverlays/cooldownOverlay');
const repoDeathOverlay = require('./repoOverlays/deathOverlay');

// Инициализируем команды
let commands = loadCommands();

const reloadAll = () => {
    delete require.cache[require.resolve('./config')];
    delete require.cache[require.resolve('./wrappers')];
    
    config = require('./config');
    commandWrapper = require('./wrappers').commandWrapper;
    
    // Перезагружаем все файлы команд из папки
    commands = loadCommands();
    
    deps.config = config;
    console.log(">>> Система полностью обновлена");
};

const deps = { 
    client, 
    config, 
    reloadAll,
    getCommands: () => commands,
    // Создаем безопасную функцию отправки сообщений
    say: async (target, context, message) => {
        console.log(`Отвечаю: ${message}`);

        if (config.replyEnabled === false)
            return;

        const myChannel = '#iagan3228';
        const myName = myChannel.replace('#', '');
        const isMyChannel = target.toLowerCase() === myChannel;
        const isSentByMe = context && context.username.toLowerCase() === myName;
        const isSentByTekken = context && context.username.toLowerCase() === "tekkenking64";
        const isSentByAnyone = true;
        
        if (isMyChannel || isSentByMe || isSentByTekken || isSentByAnyone) {
            const maxAttempts = 5;
            for (let i = 1; i <= maxAttempts; i++) {
                try {
                    // Пытаемся отправить сообщение через tmi.js
                    await client.say(target, message);
                    return; // Успех, выходим из цикла
                } catch (err) {
                   const time = new Date().toLocaleTimeString();
                    console.error(`[${time}] [Retry ${i}/${maxAttempts}] Ошибка в ${target}: ${err}`);
                    
                    if (i === maxAttempts) {
                        console.error(`[Twitch Error] Финальный сбой после 5 попыток в ${target}`);
                        return;
                    }

                    // Пауза перед следующей попыткой (1с, 2с, 3с...) для эффективности
                    await new Promise(res => setTimeout(res, 1000 * i));
                }
            }
        } else {
            console.log(`[Shield] Игнорирую ответ для ${context?.username} в чужом чате ${target}`);
        }
    }
};

initTerminal(deps, commandWrapper);

client.on('message', (target, context, msg, self) => {
    if (self) return;

    //chat.addMessage(target, context.username, msg);

    const parts = msg.trim().split(/\s+/); 
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);
    const currentCommands = commands; // Твой объект со всеми командами

    if (currentCommands[commandName]) {
        const cmd = currentCommands[commandName];
        const isMyChannel = target.toLowerCase() === '#iagan3228';

        if (context.username != "iagan3228" && cmd.admin === true) {
            console.log(`[Shield] Отказано в доступе к ${commandName} для ${context.username}`);
            return;
        }

        // Логика: выполняем если это мой канал ИЛИ если команда публичная
        if (isMyChannel || cmd.public === true) {
            // Добавили commandName в конце!
            commandWrapper(deps, () => cmd.execute(deps, target, context, args), context, commandName);
        }
    }
});

client.on('reconnect', () => {
    console.log('[Twitch] Попытка переподключения...');
});

let connected = false;
const CONNECT_INTERVAL = 5000;
(async () => {
    let connected = false;

    while (!connected) {
        try {
            console.log('[Twitch] Попытка подключения...');
            await client.connect(); 
            console.log('[Twitch] Успешно подключено!');
            connected = true; 
        } catch (err) {
            console.error(`[Ошибка] Не удалось зайти: ${err.message || err}`);
            console.log(`[Twitch] Следующая попытка через ${CONNECT_INTERVAL / 1000} сек...`);
            
            // Явное определение промиса для паузы
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(); // Вызываем resolve, когда таймер истек
                }, CONNECT_INTERVAL);
            });
        }
    }
})();

if (config.repoEnabled) {
    console.log("[SYSTEM] Мод REPO включен в конфиге. Запускаю мониторинг логов...");
    repoLogOverlay.init();
    repoСooldownOverlay.init();
    repoDeathOverlay.init();
} else {
    console.log("[SYSTEM] Мод REPO выключен.");
}