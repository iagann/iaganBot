const { isGameActive } = require('../window'); // Поднимаемся на уровень выше

const runRepoAction = async (deps, actionName, callback) => {
    const { robot, config } = deps;

    if (!config.repoEnabled) {
        console.log(`[System] ${actionName} сейчас отключен в конфиге.`);
        return;
    }

    if (!robot) {
        return console.error("RobotJS не загружен!");
    }

    const appName = "R.E.P.O.";
    const active = await isGameActive(appName);
    if (!active) {
        console.log(`${appName} window is not active`);
        return;
    }

    // Если всё ок — запускаем саму логику команды
    callback(robot);
};

module.exports = {
    '!прыжок': {
        execute: (deps, target, context) => {
            runRepoAction(deps, "Прыжок", (robot) => {
                console.log(`[Action] ${context.username} -> Прыжок`);
                deps.say(target, context, `@${context.username} заставил стримера прыгнуть! ⏫`);
                const jumpKey = 'space';
                robot.keyToggle(jumpKey, 'up');
                robot.keyToggle(jumpKey, 'down');
                setTimeout(() => robot.keyToggle(jumpKey, 'up'), 50);
            });
        }
    },

    '!гуськом': {
        execute: (deps, target, context) => {
            runRepoAction(deps, "Гуськом", (robot) => {
                console.log(`[Action] ${context.username} -> Присесть`);
                deps.say(target, context, `@${context.username} заставил стримера присесть! 🦆`);
                const crouchKey = 'c';
                robot.keyToggle(crouchKey, 'up');
                robot.keyToggle(crouchKey, 'down');
                setTimeout(() => {
                    robot.keyToggle(crouchKey, 'up');
                    console.log(`[RobotJS] Кнопка ${crouchKey} отпущена`);
                }, 5000);
            });
        }
    }
};