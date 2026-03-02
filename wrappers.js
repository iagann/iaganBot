// wrappers.js
const cooldowns = new Set();

function commandWrapper(deps, action, context) {
    const { config } = deps; // Берем актуальный конфиг
    //const user = context.username;
    const user = "global";

    if (cooldowns.has(user)) {
        console.log(`[Cooldown] ${user} ждет...`);
        return;
    }

    if (context.username.toLowerCase() !== 'iagan3228') {
        cooldowns.add(user);
        setTimeout(() => cooldowns.delete(user), config.cooldownTime);
    }

    setTimeout(() => {
        try {
            action();
        } catch (err) {
            console.error(`Ошибка в команде: ${err.message}`);
        }
    }, config.timeout);
}

module.exports = { commandWrapper };