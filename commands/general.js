const repoCommands = require('./repo');

module.exports = {
    '!reload': { 
        admin: true,
        execute: (deps, target, context) => {
            try {
                // Вызываем глобальную перезагрузку из index.js
                deps.reloadAll();
                deps.say(target, context, "⚙️ Бот перезагружен!");
            } catch (e) {
                deps.say(target, context, "❌ Ошибка при перезагрузке.");
            }
        }
    },

    '!привет': { 
        public: true,
        execute: (deps, target, context) => {
            const { client } = deps;
            deps.say(target, context, `Привет, @${context.username}! Я тебя слышу.`);
        }
    },

    '!бамжевала': { 
        public: true,
        execute: (deps, target, context) => {
            const { client } = deps;
            deps.say(target, context, `@${context.username} БАМ ЖЕ ВА ЛА!`);
        }
    },

    '!монетка': {
        public: true,
        execute: (deps, target, context) => {
            // Генерируем случайное число: 0 или 1
            const result = Math.random() < 0.5 ? 'Орел' : 'Решка';
            
            // Отправляем результат в чат
            deps.say(target, context, `@${context.username}, выпало: ${result}!`);
        }
    },

    '!команды': { 
        execute: (deps, target) => {
            const allCommands = deps.getCommands();
            
            // Фильтруем: оставляем только те, у которых НЕТ флага admin (или он false)
            const visibleCommands = Object.entries(allCommands)
                .filter(([name, cmd]) => !cmd.admin) // Убираем админские
                .map(([name, cmd]) => name);        // Оставляем только названия
                
            const available = visibleCommands.join(', ');
            deps.say(target, context, `Доступные команды: ${available}`);
        }
    },

    '!репо': {
        public: true,
        execute: (deps, target, context) => {
            // Берем только ключи (названия команд) из объекта repoCommands
            const keys = Object.keys(repoCommands);
            
            if (keys.length === 0) {
                return deps.say(target, context, `@${context.username}, команд для R.E.P.O. пока нет. 🛠️`);
            }

            // Собираем их в строку через запятую
            const commandList = keys.join(', ');
            
            deps.say(target, context, `Команды для R.E.P.O.: ${commandList}`);
        }
    },
}