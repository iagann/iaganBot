const http = require('http');
const lang = require('../lang');

let isGodMode = false;

function sendToGame(action, param) {
    const urlParam = param !== undefined ? `/${encodeURIComponent(param)}` : '';
    const url = `http://127.0.0.1:13337/${action}${urlParam}`;
    http.get(url, () => {}).on('error', (e) => console.error(`[Error] ${e.message}`));
}

const runAction = (deps, actionName, callback) => {
    if (deps.config && !deps.config.repoEnabled) return;
    callback();
};

// Универсальный исполнитель
const core = {
    jump: (deps, target, context, locale) => {
        runAction(deps, "Jump", () => {
            const msg = lang[locale].jump(context.username);
            deps.say(target, context, `@${msg} ⏫`);
            sendToGame('jump');
            sendToGame('msg', msg);
        });
    },
    jumps: (deps, target, context, locale) => {
        runAction(deps, "Jumps", () => {
            const msg = lang[locale].jumps(context.username);
            deps.say(target, context, `@${msg} ⏫`);
            sendToGame('jumps');
            sendToGame('msg', msg);
        });
    },
    pushUp: (deps, target, context, locale, args) => {
        runAction(deps, "PushUp", () => {
            let power = parseInt(args[0]);
            // Лимит: от 5 (мини-хоп) до 50 (космос), по умолчанию 15 (выход из ямы)
            power = (!isNaN(power)) ? Math.min(Math.max(power, 5), 50) : 15;
            
            const msg = locale === 'ru' 
                ? `${context.username} подбросил стримера вверх! (Сила: ${power})`
                : `${context.username} launched the streamer up! (Force: ${power})`;

            sendToGame(`push_up/${power}`);
            deps.say(target, context, `@${msg} 🚀`);
            sendToGame('msg', msg);
        });
    },
    crouch: (deps, target, context, locale) => {
        runAction(deps, "Crouch", () => {
            const msg = lang[locale].crouch(context.username);
            deps.say(target, context, `@${msg} 🦆`);
            sendToGame('crouch');
            sendToGame('msg', msg);
        });
    },
    spawn: (deps, target, context, locale, enemyId, actionName, emoji) => {
        runAction(deps, actionName, () => {
            const msg = lang[locale].spawn[actionName](context.username);
            deps.say(target, context, `@${msg} ${emoji}`);
            sendToGame('spawn', enemyId);
            if (enemyId === 'Enemy - Hunter' || enemyId === 'Enemy - Runner') {
                sendToGame('alert', msg);
            } else {
                sendToGame('msg', msg);
            }
        });
    },
    randomEnemy: (deps, target, context, commandsObj, currentCmd) => {
        // Находим все ключи спавна, ИСКЛЮЧАЯ саму команду рандома
        const spawnKeys = Object.keys(commandsObj).filter(k => 
            commandsObj[k].isSpawn && k !== currentCmd
        );
        
        const randomKey = spawnKeys[Math.floor(Math.random() * spawnKeys.length)];
        
        if (randomKey) {
            console.log(`[Random] Выпал моб: ${randomKey}`);
            commandsObj[randomKey].execute(deps, target, context);
        }
    },
    setLifespan: (deps, target, context, locale, args) => {
        // Проверяем, ввел ли пользователь число
        const newTime = parseInt(args[0]);
        
        if (isNaN(newTime)) {
            return deps.say(target, context, locale === 'ru' 
                ? `@${context.username}, укажите число секунд (напр. !таймер 60)` 
                : `@${context.username}, specify seconds (e.g. !lifespan 60)`);
        }

        // Ограничиваем на стороне бота (от 5 до 300 сек)
        const validatedTime = Math.min(Math.max(newTime, 5), 300);

        runAction(deps, "SetLifespan", () => {
            sendToGame(`spawn/lifespan/${validatedTime}`);
            
            const msg = locale === 'ru'
                ? `Время жизни врагов установлено на ${validatedTime}с. ⏱️`
                : `Enemy lifespan set to ${validatedTime}s. ⏱️`;
                
            deps.say(target, context, `@${context.username}, ${msg}`);
        });
    },

    god: (deps, target, context, locale, state) => {
        runAction(deps, "GodMode", () => {
            isGodMode = state;
            const msg = state ? lang[locale].god_on(context.username) : lang[locale].god_off(context.username);
            sendToGame(state ? 'god/on' : 'god/off');
            deps.say(target, context, `@${msg}`);
        });
    },
    stamina: (deps, target, context, locale, state) => {
        runAction(deps, "InfiniteStamina", () => {
            isGodMode = state;
            const msg = state ? lang[locale].stamina_on(context.username) : lang[locale].stamina_off(context.username);
            sendToGame(state ? 'stamina/on' : 'stamina/off');
            deps.say(target, context, `@${msg}`);
        });
    },
    health: (deps, target, context, locale, type, args) => {
        if (type === 'damage' && isGodMode) {
            return deps.say(target, context, lang[locale].damage_god(context.username));
        }
        runAction(deps, type === 'heal' ? "Heal" : "Damage", () => {
            let amount = parseInt(args[0]);
            amount = (!isNaN(amount)) ? Math.min(Math.max(amount, 1), 50) : Math.floor(Math.random() * 50) + 1;
            const msg = lang[locale][type](context.username, amount);
            sendToGame(`${type}/${amount}`);
            deps.say(target, context, `@${msg}`);
        });
    }
};

module.exports = { core, sendToGame, isGodMode };