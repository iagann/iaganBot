const repoCommandsRu = require('./repo_ru');
const repoCommandsEn = require('./repo_en');

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
                
            const available = visibleCommands.join(' ');
            deps.say(target, context, `Доступные команды: ${available}`);
        }
    },

    '!репо': {
        public: true,
        execute: (deps, target, context) => {
            const keys = Object.keys(repoCommandsRu);
            if (keys.length === 0) return deps.say(target, context, `@${context.username}, команд пока нет. 🛠️`);

            // Разделяем на спецэффекты и мобов для читаемости
            const effects = keys.filter(k => !repoCommandsRu[k].isSpawn).join(' ');
            const spawns = keys.filter(k => repoCommandsRu[k].isSpawn).join(' ');

            deps.say(target, context, `Команды R.E.P.O.: Действия: ${effects} | Враги: ${spawns}`);
        }
    },

    // --- Английская справка ---
    '!repo': {
        public: true,
        execute: (deps, target, context) => {
            const keys = Object.keys(repoCommandsEn);
            if (keys.length === 0) return deps.say(target, context, `@${context.username}, no commands yet. 🛠️`);

            const effects = keys.filter(k => !repoCommandsEn[k].isSpawn).join(', ');
            const spawns = keys.filter(k => repoCommandsEn[k].isSpawn).join(', ');

            deps.say(target, context, `R.E.P.O. Commands: Actions: ${effects} | Enemies: ${spawns}`);
        }
    },
}