// index.js
let { client } = require('./connection');
let { loadCommands } = require('./commands'); // Импорт загрузчика
let { commandWrapper } = require('./wrappers');
let config = require('./config');
let robot = require('robotjs');
let { initTerminal } = require('./terminal');
let chat = require('./commands/chat');

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
    robot, 
    config, 
    reloadAll,
    getCommands: () => commands,
    // Создаем безопасную функцию отправки сообщений
    say: (target, context, message) => {
        const myChannel = '#iagan3228'; // Твой канал (обязательно с решеткой)
        const myName = myChannel.replace('#', '');
        const isMyChannel = target.toLowerCase() === '#iagan3228';
        const isSentByMe = context && context.username.toLowerCase() === myName;
        
        if (isMyChannel || isSentByMe) {
            client.say(target, message);
        } else {
            // В чужом чате на команды других просто молчим в консоль
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
            commandWrapper(deps, () => cmd.execute(deps, target, context, args), context);
        }
    }
});

client.connect();