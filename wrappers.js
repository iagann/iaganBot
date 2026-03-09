// wrappers.js
const repoCommandsRu = require('./commands/repo_ru');
const repoCommandsEn = require('./commands/repo_en');

const cooldowns = new Set();
const cooldownsRepo = new Set();

// Добавили 4-й аргумент commandName
function commandWrapper(deps, action, context, commandName) {
    const { config } = deps; 
    const user = context.username;

    // Проверяем, есть ли вызванная команда в списках REPO
    const isRepoCommand = (commandName in repoCommandsRu) || (commandName in repoCommandsEn);

    // 1. Сначала проверяем глобальный кулдаун (для ВСЕХ команд)
    if (cooldowns.has(user)) {
        console.log(`[Cooldown] ${user} ждет базового кулдауна...`);
        return;
    }

    // 2. Затем проверяем специальный REPO-кулдаун (ТОЛЬКО для REPO-команд)
    if (isRepoCommand && cooldownsRepo.has(user)) {
        console.log(`[Cooldown] ${user} ждет REPO-кулдауна...`);
        return;
    }

    // Если это не стример, вешаем кулдауны
    if (context.username.toLowerCase() !== 'iagan3228') {
        
        // Глобальный кулдаун вешаем в любом случае
        cooldowns.add(user);
        setTimeout(() => cooldowns.delete(user), config.cooldownTime || 10000);

        // Если команда из REPO, дополнительно вешаем долгий кулдаун
        if (isRepoCommand) {
            cooldownsRepo.add(user);
            setTimeout(() => cooldownsRepo.delete(user), config.cooldownTimeRepo || 30000);
        }
    }

    // Выполнение самой команды
    setTimeout(() => {
        try {
            action();
        } catch (err) {
            console.error(`Ошибка в команде: ${err.message}`);
        }
    }, config.timeout || 0);
}

module.exports = { commandWrapper };