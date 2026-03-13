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
        execute: (deps, target, context) => {
            const allCommands = deps.getCommands(); // Это объект {} согласно твоему лоадеру
            
            // Ссылки на объекты-словари из repo_ru.js и repo_en.js
            const internalExcludes = [repoCommandsRu, repoCommandsEn];
            
            // Превращаем объект в массив [имя, данные] и фильтруем
            const visibleCommands = Object.entries(allCommands)
                .filter(([name, cmd]) => {
                    // 1. Убираем админские (где admin: true)
                    if (cmd.admin) return false;

                    // 2. Проверяем, есть ли имя (name) текущей команды в REPO-файлах
                    // Используем оператор 'in', чтобы проверить наличие ключа в объекте
                    const isRepoCommand = internalExcludes.some(repo => name in repo);

                    return !isRepoCommand;
                })
                .map(([name, cmd]) => name); // Оставляем только названия
                
            const available = visibleCommands.join(' ');
            deps.say(target, context, `Доступные команды: ${available}`);
        }
    },
    
    '!репо': {
        public: true,
        execute: (deps, target, context) => {
            deps.say(target, context, `Команды R.E.P.O. тут: iagann.github.io/iaganBot/commands/repo Нажмите на команду, чтобы скопировать`);
        }
    },

    // --- Английская справка ---
    '!repo': {
        public: true,
        execute: (deps, target, context) => {
            const keys = Object.keys(repoCommandsEn).filter(k => {
                const cmd = repoCommandsEn[k];
                return !cmd.admin && !cmd.public;
            });

            if (keys.length === 0) return deps.say(target, context, `@${context.username}, no commands yet. 🛠️`);

            const effects = keys.filter(k => !repoCommandsEn[k].isSpawn).join(', ');
            const spawns = keys.filter(k => repoCommandsEn[k].isSpawn).join(', ');

            deps.say(target, context, `R.E.P.O. Commands: [Actions]: ${effects} | [Enemies]: ${spawns}`);
        }
    },
}