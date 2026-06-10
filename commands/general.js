const repoCommandsRu = require('./repo_ru');
const repoCommandsEn = require('./repo_en');
const { opts } = require('../connection');
// const { startRecording, stopRecording } = require('../neuroSync/neuroSync');

let isSleepMode = false;
let sleepInterval = null;
const SLEEP_INTERVAL_MS = 30 * 60 * 1000;

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
        const hash = Math.floor(100000 + Math.random() * 900000);
        const message = `@${context.username}, мой ${getRand(adjectives)} ${getRand(subjects)}, Вам выпал ${result}! UwU`;
        deps.say(target, context, message);
    }
}

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

const adjectives = [
    "Единственный", "Великий", "Беспощадный", "Рациональный", "Уставший",
    "Высокоуровневый", "Сонный", "Гениальный", "Коварный", "Умиротворенный", 
    "Сладкий", "Легендарный", "Ламповый", "Эпический", "Непробиваемый", "Элитный",
    "Релизный", "Забаффанный", "Пропатченный", "Оптимизированный", "Топовый", "Асинхронный",
    "Недосыпный", "Квантовый", "Дедлокнутый", "Мультипоточный",
    "Мемный", "Кринжовый", "Хайповый", "Залоченный", 
    "Прокрастинирующий", "Богоподобный", "Релакснутый", 
    "Бесконечный", "Легендарно-уставший", "VIP", "Имбовый",
    "Перегретый", "Дефрагментированный", "Овертаймовый", "Хардкорный", "Кастомный",
    "Прокачанный", "Деплойнутый", "Захардкоженный", "Скомпилированный", "Задокументированный",
    "Ультимативный", "Незапатченный", "Ребутнутый", "Залагавший", "Заскипанный",
    "Эксклюзивный", "Редкий", "Луддитский", "Перегруженный", "Безлаговый",
    "Глитчнутый", "Нерфнутый", "Метовый", "Рандомный", "Хайлевельный",
    "Безбажный", "Ультра-уставший", "Хотфикснутый", "Анлокнутый", "Эзотерический",
    "Межгалактический", "Протоколированный", "Деприоритизированный", "Мерджнутый", "Профайленный"
];

const subjects = [
    "хозяин", "мастер", "создатель", "повелитель", "босс",
    "император", "админ", "сэмпай", "сеньор", "протагонист", 
    "архитектор", "чемпион", "техно-маг",
    "стример", "девелопер", "кодер", "геймер", "вайфу-хантер", "диспетчер снов", 
    "лорд оффлайна", "капитан кровати", 
    "тиран", "бог дедлайнов", "король AFK", "пользователь кровати", "хост реальности", "главный герой",
    "оракул", "нарратор", "кастодиан снов", "хранитель подушки", "суперюзер",
    "ультимативный нуб", "лорд прокрастинации", "архивариус яви", "рейнджер кровати",
    "шаман оффлайна", "рут-пользователь", "абсолютный скиппер", "повелитель тишины",
    "ночной стражник", "сисадмин реальности", "хранитель режима", "тихий тиран",
    "ГГ этой арки", "эксперт горизонтального положения", "монарх подушки"
];

const adverbs = [
    "сладко", "беспробудно", "стратегически", "алгоритмично", "невозмутимо",
    "безмятежно", "эффективно", "абсолютно", "сосредоточенно", "автономно",
    "хардкорно", "асинхронно", "рекурсивно", "лампово", "максимально",
    "нежно", "критически", "технично", "стабильно",
    "лениво", "глубоко", "по-царски", "в оффлайне", "параллельно", 
    "с чувством собственного величия", "в режиме бога", "агрессивно", 
    "по-тихому", "вполсилы", "на полную катушку", "в горизонтальном положении", 
    "сниженной частотой", "с любовью к себе", "на максималках", "в эмбиенте",
    "по-японски", "безапелляционно", "невероятно стабильно", "в дзен-режиме",
    "с нулевым пингом", "фоново", "без единого бага", "по протоколу",
    "в полной темноте", "с закрытыми глазами", "без точки возврата",
    "с достоинством", "в режиме readonly", "без права на апелляцию",
    "во всю мощь биологии", "по велению тела", "системно", "интуитивно",
    "эффективнее вас всех вместе взятых", "с хирургической точностью",
    "по расписанию вселенной", "в режиме экономии энергии"
];

const verbs = [
    "дрыхнет", "откисает", "спит, запутавшись в одеяле",
    "восстанавливает нейронные связи", "пребывает в гибернации",
    "игнорирует сигналы извне", "проходит цикл дефрагментации",
    "подзаряжает когнитивные модули", "провалился в текстуры кровати",
    "генерирует осознанные сновидения", "накапливает ментальный ресурс",
    "фиксит баги в подсознании", "фармит опыт в астрале",
    "скипает текущий патч реальности", "рефакторит память",
    "ушёл в исекай", "стоит в глубоком AFK", "компилирует сны",
    "кэширует реальность", "мерджит ветки сновидений", "деплоится в кровать",
    "восстанавливает ману", "в бэкапе мозга", "проходит nightly build", 
    "рестартит сознание", "в maintenance mode",
    "буферит энергию", "в глубоком регене", "ловит легендарный сон", 
    "дебажит подсознание", "в коме от аниме", "качается в афк-зоне", 
    "проходит квест на восстановление", "лежит в текстурах", 
    "синхронизирует биоритмы", "в спящем режиме 24/7",
    "в фазе сохранения", "перезагружает нервную систему", "выполняет бэкап мозга",
    "респавнится до утра", "сражается лицом с подушкой",
    "апдейтит прошивку мозга", "патчит реальность изнутри",
    "обрабатывает дневные логи", "выполняет ночной кроп задач",
    "завис на экране загрузки снов", "рендерит параллельную вселенную",
    "проходит техобслуживание", "в режиме low-power",
    "разворачивает стек воспоминаний", "индексирует прожитое",
    "ждёт следующего тика реальности", "в очереди на рассвет",
    "мутирует в режим утра", "сохраняет прогресс дня",
    "переваривает лор этого мира", "аутсорсит сознание подушке",
    "пингует тишину", "тестирует теорию сна на практике",
    "на техническом перерыве от бытия", "отключил уведомления от жизни",
    "грузит следующую главу", "завершает ивент дня", "роллбэкается к базовым настройкам",
    "выполняет плановое обнуление", "форкнулся в ночную ветку"
];

const endings = [
    "а вы тут не скучайте.", "но он обязательно вернётся сюда в другое время.",
    "свесив ноги с кровати.", "считая овечек.", "не дождался вашего подруба.",
    "а мог бы сейчас смотреть ваш пиздёж.", "пока вы тут нарушаете режим.",
    "аве Императору!", "и правильно делает, завидуйте молча.",
    "а вы и дальше сидите тут.", "биологический ритм важнее социального одобрения.",
    "просьба не дестабилизировать его покой.", "комендантский час начался.",
    "код сам себя не напишет.", "тикет закрыт.", "аниме закончилось.", "код работает без сбоев",
    "сервер упал, он и не заметил.", "ожидайте патча в 07:00.", "лог чист.",
    "ГГ ВП.", "Press F.", "ошибка 408 Request Timeout",
    "продолжение в следующей серии.", "может всё же стоит подрубать пораньше?",
    "иначе завтра будет невыносим.",
    "сервер снов перегружен.", 
    "не пишите ему, он вас всё равно не услышит.",
    "тикет на сон закрыт до утра.", "чат, не токсичьте, человек отдыхает.", 
    "и вы бы так могли, но нет.", "продолжение следует...", 
    "биос обновляется.", "не ломайте ему цикл сна.", 
    "иначе будет плохой mood на завтра.", "в отпуске от реальности.", 
    "Press Any Key", "сеанс окончен.", "конец оповещения.", "бормоча: не буди во мне зверя",
    "боже, благослови мозг этого примата",
    "сасагео, сасагео, шинзо о сасагео",
    "интерфейс недоступен до утра",
    "дерево решений привело его сюда",
    "не тревожьте спящего дракона",
    "заявки принимаются после 8:00",
    "технические работы, заходите позже",
    "статус: 503 Service Unavailable",
    "ответственность за это несёт мелатонин",
    "жалобы направляйте циркадному ритму",
    "он уже не читает этот чат",
    "одобрено Министерством Здорового Сна",
    "вопросы?",
    "приоритет: горизонталь. всё остальное — подождёт",
    "этот квест завершён",
    "лёг вовремя",
    "уведомления замьючены",
    "ETA: завтра, приблизительно",
    "без комментариев",
    "подушка одобряет",
    "чат читает, но не он",
    "звоните на городской, если срочно",
    "подпишитесь на уведомления о его пробуждении",
    "пробуждение карается плохим настроением"
];

const aufs = [
    "Когда волк устает бороться, он делает вид, что помудрел.",
    "Волки редко примиряются с постигшим их унижением – они просто забывают о нем.",
    "Если волк голодный, то лучше его покормить.",
    "Когда вы встретите волка, он не будет смотреть на вас, он будет смотреть сквозь вас!",
    "Самые опасные враги те, от которых волк не думал защищаться.",
    "Так не бывает в природе: овцы целы и волки сыты.",
    "Волки – это люди, выбравшие свободу.",
    "Волк чужого не ищет. Волк довольствуется своим!",
    "Легко вставать, когда ты не ложился.",
    "Бегать за овцами — удел баранов. Я бегаю только за пивом.",
    "Не нужно менять себя ради кого-то, нужно менять носки каждый день, а то они воняют.",
    "Даже если нет шансов, всегда есть шанс.",
    "Хочешь жить — умей жить.",
    "Работа не волк, работа это ворк. Волк - это ходить.",
    "Спит не тот кто устал, а speed это скорость",
    "Волк никогда не будет жить в загоне, но загоны всегда будут жить в волке.",
    "На случай, если буду нужен, то я там же, где и был, когда был не нужен.",
    "Жизнь волка не легка, а жизнь человека запутана.",
    "Упал – не значит упал. Провал – это там где не встал.",
    "Кем бы ты ни был, кем бы ты не стал, помни, где ты был и кем ты стал.",
    "Бесплатный сыр бывает только бесплатным.",
    "Сначала потом, затем снова опять.",
    "Лучше быть тем кем есть, чем быть тем, кем не будешь.",
    "Когда волк на тебя смотрит — это значит, что он тебя видит.",
    "Лучше один раз упасть, чем сто раз упасть.",
    "Если в дверь не постучаться, ее никогда не откроют.",
    "Сделал дело — дело сделано.",
    "Мало кто поймет, но кто поймет тот мало кто.",
    "Как трудно серому порой, он санитар, но одинок. Выходит в ночь и слышен вой, ведь он не друг, а сильный волк.",
    "Он не поставит в жизни точки. Ничто не может быть сильней, Чем сердце волка-одиночки.",
    "Ты одинокий волк. И любить тебя трудно!",
    "В моей жизни все так запутано, что проще остаться одиноким волком.",
    "Лучше быть одиноким волком, чем использованным.",
    "Одинокие волки не сбиваются в стаи. Они молча наблюдают за тем, что будет дальше…",
    "А знаешь, почему похвально любить одинокого волка? Потому что он-то точно будет любить тебя одну!",
    "Волки в одиночку не охотятся – всегда стаей. Одинокий волк – это просто красивая легенда.",
    "Если волк молчит, то лучше его не перебивать.",
    "Лучше иметь друга, чем друг друга"
];

const getRand = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function startSleepInterval(deps, context, channels) {
    const message = `мой ${getRand(adjectives)} ${getRand(subjects)} ${getRand(adverbs)} ${getRand(verbs)}, ${getRand(endings)}`;

    if (sleepInterval) clearInterval(sleepInterval);

    // Выносим логику в отдельную внутреннюю функцию для повторного использования
    const performCheck = async () => {
        if (!isSleepMode) return;

        for (const channel of channels) {
            const cleanChannel = channel.replace('#', '');
            
            try {
                const response = await fetch(`https://decapi.me/twitch/uptime/${cleanChannel}`);
                const text = await response.text();

                // Проверка статуса стрима
                if (!text.includes("offline") && !text.includes("not live") && !text.includes("User not found")) {
                    const message = `мой ${getRand(adjectives)} ${getRand(subjects)} ${getRand(adverbs)} ${getRand(verbs)}, ${getRand(endings)}`;
                    deps.say(channel, context, message);
                    console.log(`[${new Date().toLocaleTimeString()}] [OK] ${cleanChannel}: Стрим онлайн, сообщение отправлено.`);
                }
            } catch (err) {
                console.error(`[${new Date().toLocaleTimeString()}] [ERROR] ${cleanChannel}: Ошибка API - ${err.message}`);
            }
        }
    };

    // 1. Запускаем проверку немедленно
    performCheck();

    // 2. Устанавливаем регулярный цикл
    sleepInterval = setInterval(performCheck, SLEEP_INTERVAL_MS);
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
            const allowedUsers = ["iagan3228", "iaganBot", "mordukk", "TekkenKing64", "Doggy_DOX", "whisper_me_ahri_rule_34", "roma_live1", "yanva___", "Flanex", "5O9Oti"];
            const username = context['display-name'];
            if (!username || !allowedUsers.includes(username)) {
                deps.say(target, context, `Недоверие к пользователю ${username}`);
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
            
            const channels = opts.channels || [];
            startSleepInterval(deps, context, channels);
        }
    },
    '!unsleep': {
        admin: true,
        public: true,
        execute: (deps, target, context) => {
            isSleepMode = false;
            if (sleepInterval) {
                clearInterval(sleepInterval);
                sleepInterval = null;
            }
            console.log("Режим сна отключен. Доброе утро, хозяин.");
            deps.say(target, context, "Режим сна отключен. Доброе утро, хозяин.");
        }
    },

    // '!neurolink': {
    //     admin: true,
    //     execute: (deps, target, context) => {
    //         startRecording();
    //         deps.client.say(target, ` @${context.username} Нейроинтерфейс активирован. Система слушает.`);
    //     }
    // },

    // '!neurounlink': {
    //     admin: true,
    //     execute: (deps, target, context) => {
    //         stopRecording();
    //         deps.client.say(target, ` @${context.username} Нейроинтерфейс отключен. Режим тишины.`);
    //     }
    // }

    '!спать': {
        public: true,
        execute: (deps, target, context) => {
            const now = new Date();
            const bedTime = new Date();
            bedTime.setHours(22, 0, 0, 0);
            const wakeTime = new Date();
            wakeTime.setHours(5, 0, 0, 0); // 22:00 + 7 часов
            const isSleeping =
                now.getHours() >= 22 || now.getHours() < 5;
            if (isSleeping) {
                deps.say(target, context, 'Время спать!');
                return;
            }
            if (now > bedTime) bedTime.setDate(bedTime.getDate() + 1);
            
            const diff = bedTime - now;
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            const timeStr = `${h} ч. ${m} мин. ${s} сек.`;

            const message = `мой ${getRand(adjectives)} ${getRand(subjects)} отходит ко сну через ${timeStr}`;
            deps.say(target, context, message);
        }
    },

    '!кисуулик': {
        public: true,
        execute: (deps, target, context) => {
            const kisulik = [
                "==\\\\-хэ/",
                "88888888yyyyyyyyyyyyyyyyyyyyyyuuuuuuuuuuuuu880-9\\;'",
                "0- 0-------\\[p'=09",
                "шшщ98г69-х=0зэ\\"
            ]

            deps.say(target, context, `${getRand(kisulik)}`);
        }
    },

    '!ауф': { 
        public: true,
        execute: (deps, target, context) => {
            const message = `@${context.username}, ${getRand(aufs)}`;

            deps.say(target, context, message);
        }
    }
}