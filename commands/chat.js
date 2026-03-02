// chat.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI;
{
    genAI = new GoogleGenerativeAI("");
}
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash", // 2.0 сейчас самая стабильная для SDK
});
async function list() {
    try {
        // В новых версиях SDK этот метод может быть в разных местах, 
        // попробуем самый прямой путь через fetch, если SDK капризничает, 
        // но обычно работает это:
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${genAI.apiKey}`);
        const data = await response.json();
        console.log("Доступные модели:");
        data.models.forEach(m => console.log(`- ${m.name}`));
    } catch (e) {
        console.error("Не удалось получить список моделей", e);
    }
}
//list();

// Используем global, чтобы история не стиралась при !reload
if (!global.chatHistory) {
    global.chatHistory = new Map();
}
const history = global.chatHistory;

const MAX_CHANNEL_MESSAGES = 10000;

const addMessage = (channel, username, text) => {
    const chan = channel.toLowerCase();
    
    if (!history.has(chan)) {
        history.set(chan, []);
    }

    const channelLog = history.get(chan);
    
    // Сохраняем как объект для контекста
    channelLog.push({
        username: username.toLowerCase(),
        text: text,
        timestamp: Date.now()
    });

    // Лимит 10 000 сообщений на весь канал
    if (channelLog.length > MAX_CHANNEL_MESSAGES) {
        channelLog.shift();
    }
};

const getHistory = (channel, username) => {
    // 1. Защита от отсутствия канала
    if (!channel) return []; 
    
    const chan = channel.toLowerCase();
    const channelLog = history.get(chan) || [];
    
    // 2. Проверяем, передан ли username
    if (!username) {
        // Если username не задан, возвращаем ВЕСЬ лог канала (для контекста)
        return channelLog;
    }

    // 3. Теперь безопасно вызываем toLowerCase, так как мы знаем, что username есть
    const user = username.toLowerCase();
    return channelLog.filter(m => m.username === user);
};

async function analyzeUserBehavior(targetUser, logs) {
    if (!logs || logs.length === 0) return "Данных для анализа нет.";

    // Форматируем логи в компактный текст: [Время] Юзер: Сообщение
    const formattedLogs = logs.map(m => {
        return `[${m.username}: ${m.text}`;
    }).join('\n');

    const prompt = `
        Ты — эксперт-модератор Twitch. Перед тобой последние сообщения из чата.
        Твоя задача: проанализировать поведение пользователя @${targetUser}.
        
        Вот контекст чата (последние сообщения):
        ${formattedLogs}
        
        Оцени @${targetUser} по следующим критериям:
        1. Уровень токсичности (0-10).
        2. Общее настроение (позитивный/нейтральный/агрессивный).
        3. Краткий вердикт (1 предложение): стоит ли его банить или он адекватен?
        
        Ответь кратко, чтобы сообщение влезло в чат Twitch (макс 400 символов).
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("[AI Error]", error);
        return "⚠️ Ошибка при обращении к ИИ.";
    }
}


module.exports = {
    addMessage,
    getHistory,

    // '!анализ': {
    //     public: true,
    //     admin: true,
    //     execute: async (deps, target, context, args) => {
    //         // ВАЖНО: проверяем порядок аргументов в твоем deps.say
    //         // Если ты сделал say(target, message, context), то пишем так:
    //         if (args.length === 0) {
    //             return deps.say(target, `@${context.username}, кого анализируем?`, context);
    //         }

    //         const targetUser = args[0].replace('@', '').toLowerCase();
    //         const logs = getHistory(target, targetUser); 
            
    //         if (logs.length === 0) {
    //             return deps.say(target, `@${context.username}, данных нет для ${targetUser}`, context);
    //         }

    //         const report = await analyzeUserBehavior(targetUser, logs);

    //         // Отправляем результат в чат
    //         deps.say(target, context, report);
    //     }
    // }
};