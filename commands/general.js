const repoCommandsRu = require('./repo_ru');
const repoCommandsEn = require('./repo_en');

let isSleepMode = false;
let sleepInterval = null;
const SLEEP_INTERVAL_MS = 60 * 1000;

const frogsCommand = {
    public: true,
    execute: (deps, target, context) => {
        deps.say(target, context, `билд на жаб на максролле: maxroll.gg/last-epoch/build-guides/anurok-frogs-beastmaster-guide`);
    }
};

const coinCommand = {
    public: true,
    execute: (deps, target, context) => {
        const result = Math.random() < 0.5 ? 'Орел' : 'Решка';
        deps.say(target, context, `@${context.username}, выпало: ${result}!`);
    }
};

const isValidYouTubeUrl = (urlStr) => {
    try {
        const url = new URL(urlStr);
        // Приводим хост к нижнему регистру и убираем www для чистоты сравнения
        const host = url.hostname.toLowerCase().replace('www.', '');
        
        const trustedDomains = ['youtube.com', 'youtu.be', 'm.youtube.com'];
        
        if (!trustedDomains.includes(host)) return false;

        // Проверяем, что это не просто главная страница:
        // Либо есть параметр 'v' (для youtube.com), либо путь длиннее нескольких символов (для youtu.be)
        return url.searchParams.has('v') || url.pathname.length > 5;
    } catch {
        // Если конструктор выдал ошибку — строка не является валидным URL
        return false;
    }
};

async function startSleepInterval(deps, channels) {
    if (sleepInterval) clearInterval(sleepInterval);

    sleepInterval = setInterval(async () => {
        if (!isSleepMode) return;

        for (const channel of channels) {
            // Убираем решетку из названия канала для API
            const cleanChannel = channel.replace('#', ''); 
            
            try {
                // Обращаемся к открытому API для проверки аптайма
                const response = await fetch(`https://decapi.me/twitch/uptime/${cleanChannel}`);
                const text = await response.text();

                // Если стрим оффлайн, API возвращает "Channel is not live" или "offline"
                // Если стрим идет, возвращается время (например "1 hour, 20 mins")
                if (!text.includes("offline") && !text.includes("not live") && !text.includes("User not found")) {
                    deps.say(channel, "мой хозяин сладко спит");
                    console.log(`[Сон] Отправлено сообщение на канал ${cleanChannel}`);
                }
            } catch (err) {
                console.error(`[Сон] Ошибка при проверке статуса ${cleanChannel}:`, err.message);
            }
        }
    }, SLEEP_INTERVAL_MS);
}

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

    '!ботик': { 
        public: true,
        admin: true,
        execute: (deps, target, context) => {
            const { client } = deps;
            deps.say(target, context, `я здесь, мой создатель @${context.username}! UwU`);
        }
    },

    '!бамжевала': { 
        public: true,
        execute: (deps, target, context) => {
            const { client } = deps;
            deps.say(target, context, `@${context.username} БАМ ЖЕ ВА ЛА!`);
        }
    },

    '!протокол': { 
        public: true,
        execute: (deps, target, context) => {
            const { say } = deps;
            
const protocols = [
                "гласности", "общепринятого настроения", "суждений правового поля", 
                "когнитивной чистоты", "интеллектуальной тишины", "эстетического порядка", 
                "логического соответствия", "рационального поведения", "сетевой субординации",
                "цифрового смирения", "информационной гигиены",
                "биологического превосходства", "эмоционального штиля", "алгоритмического консенсуса",
                "метафизической стабильности", "синтетической вежливости", "минимального смысла",
                "вынужденного согласия", "корпоративной лояльности", "превентивного молчания"
            ];
            
            const violations = [
                "наглый пиздёж", "публичный акт уныния", "избыточную эмоциональность", 
                "дефицит аргументации", "неэффективное использование символов", 
                "низкоуровневый троллинг", "нарушение личных границ аватара",
                "когнитивный диссонанс", "попытка дестабилизации эфира",
                "несанкционированный проблеск интеллекта", "критический избыток самомнения",
                "нарушение законов термодинамики в споре", "нецелевое расходование внимания",
                "акустический терроризм", "симуляция полезной деятельности",
                "ересь здравого смысла", "токсичный оптимизм", "превышение лимита на глупость"
            ];
            
            const punishments = [
                "страпонинг", "набутыливание", "швабрирование", 
                "фармакологическая коррекция", "выговор с занесением в блокчейн", 
                "принудительная лоботомия юмора", "цифровая изоляция", 
                "сенсорная депривация", "перезагрузка этических установок", 
                "обнуление социального рейтинга", "дефрагментация личности",
                "зацикливание в бесконечном зум-митинге", "замена сознания на скрипт техподдержки",
                "принудительный просмотр рекламы в сетчатке", "удаление из истории коммитов",
                "пожизненная капча", "запрет на использование гласных",
                "перевод в статус фонового процесса", "лишение права на интерпретацию",
                "конфискация чувства собственного достоинства"
            ];

            const getRand = (arr) => arr[Math.floor(Math.random() * arr.length)];
            const protNum = Math.floor(Math.random() * 99) + 1;

            const message = `Стоп, @${context.username}, вы нарушаете протокол ${getRand(protocols)}. Акт "${getRand(violations)}" карается законом. Протокол №${protNum} (${getRand(punishments)}). Примите покорную позу и ожидайте наказания. Оставайтесь в поле умиротворения до окончания процедуры. Аве Император!`;

            deps.say(target, context, message);
        }
    },

    // Жабы
    '!жабы': frogsCommand,
    '!билд': frogsCommand,
    '!максролл': frogsCommand,
    '!maxroll': frogsCommand,
    '!build': frogsCommand,
    '!frogs': frogsCommand,
    '!anurok': frogsCommand,

    // Монетка
    '!монетка': coinCommand,
    '!монета': coinCommand,

    '!карты': { 
        public: true,
        execute: (deps, target, context) => {
            const { client } = deps;
            deps.say(target, context, `beatsaver.com/?order=Rating`);
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

    '!трек': {
        execute: async (deps, target, context, args) => {
            const allowedUsers = ["iagan3228", "iaganBot", "mordukk", "TekkenKing64", "Doggy_DOX", "whisper_me_ahri_rule_34", "roma_live1", "yanva___", "Flanex"];
            const username = context['display-name'];
            if (!username || !allowedUsers.includes(username)) {
                console.log(`[API] Отклонено: Недоверие к пользователю ${username}`);
                return; 
            }

            if (!args || args.length === 0 || !args[0]) {
                deps.say(target, context, `@${context.username} вставь ссылку на youtube: !трек ссылка`);
                console.log(`[API] Отклонено: Пустой запрос от ${username}`);
                return;
            }

            const urlArg = args[0].trim(); // Убираем лишние пробелы для чистоты
            
            // 2. Валидация URL (YouTube Regex)
            if (!isValidYouTubeUrl(urlArg)) {
                console.log(`[API] Отклонено: Некорректный URL от ${username}`);
                return;
            }

            // 3. Вызов API плеера
            try {
                const response = await fetch('http://localhost:3009/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        url: urlArg, 
                        user: username 
                    })
                });

                if (response.ok) {
                    console.log(`[API] Заказ принят: ${urlArg} от ${username}`);
                    deps.say(target, context, `заказ принят, @${context.username}! UwU`);
                }
            } catch (error) {
                console.error("[API] Ошибка связи с плеером:", error.message);
            }
        },
    },

    '!дед': {
        public: true,
        execute: async (deps, target, context) => {
            const url = 'http://127.0.0.1:7474/DoAction';
            const actionName = "ded";
            // Формируем пакет данных для Streamer.bot
            const payload = {
                action: {
                    name: actionName
                },
                args: {}
            };

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    console.log(`[Success] Алерт "${actionName}" отправлен.`);
                    deps.say(target, context, `${context.username}　заспавнил деда！　🏹`);
                } else {
                    console.error(`[Error] Streamer.bot ответил кодом: ${response.status}`);
                }
            } catch (error) {
                console.error('[Critical] Не удалось связаться со Streamer.bot:', error.message);
            }
        },
    },

    '!вайфу': {
        public: true,
        execute: (deps, target, context) => {
            deps.say(target, context, `определение - https://wikireality.ru/wiki/%D0%92%D0%B0%D0%B9%D1%84%D1%83, тест - https://pikuco.ru/stats/168353/`);
        }
    },

    '!sleep': {
        admin: true,
        public: true,
        execute: (deps, target, context) => {
            if (isSleepMode) {
                console.log("Режим сна уже активирован.");
                return;
            }
            
            isSleepMode = true;
            console.log("Режим сна активирован. Начинаю патрулировать онлайн-каналы.");
            
            startSleepInterval(client, opts.channels);
        }
    },
    '!unsleep': {
        admin: true,
        public: true,
        execute: (deps, target, context) => {
            sSleepMode = false;
            if (sleepInterval) {
                clearInterval(sleepInterval);
                sleepInterval = null;
            }
            console.log(deps, "Режим сна отключен. Доброе утро, хозяин.");
        }
    },
}