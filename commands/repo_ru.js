const { core } = require('./repo_logic');

module.exports = {
    // --- ОБЩИЕ КОМАНДЫ ---
    '!прыжок': { execute: (d, t, c) => core.jump(d, t, c, 'ru') },
    '!хоп':    { execute: (d, t, c) => core.jump(d, t, c, 'ru') },
    '!лети': { execute: (d, t, c, a) => core.pushUp(d, t, c, 'ru', a) },
    '!сидеть': { execute: (d, t, c) => core.crouch(d, t, c, 'ru') },
    '!гуськом':{ execute: (d, t, c) => core.crouch(d, t, c, 'ru') },

    // --- СТАТУСЫ И ХП ---
    '!бог':      { execute: (d, t, c) => core.god(d, t, c, 'ru', true) },
    '!смертный': { execute: (d, t, c) => core.god(d, t, c, 'ru', false) },
    '!хил':      { execute: (d, t, c, a) => core.health(d, t, c, 'ru', 'heal', a) },
    '!урон':     { execute: (d, t, c, a) => core.health(d, t, c, 'ru', 'damage', a) },

    // --- ВРАГИ (Сложность 1) ---
    '!пёс':    { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Elsa', 'Elsa', '🐶') },
    '!велик':  { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Tricycle', 'Tricycle', '🚲') },
    '!пацан':  { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Birthday boy', 'Birthday', '🎂') },
    // '!клещ':   { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Tick', 'Tick', '🕷️') },
    '!блевота':{ isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Slow Mouth', 'SlowMouth', '👄') },

    // --- ВРАГИ (Сложность 2) ---
    '!слендер': { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Thin Man', 'ThinMan', '👤') },
    '!утка':    { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Duck', 'Duck', '🦆') },
    '!мелкий':  { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Valuable Thrower', 'Thrower', '👶') },
    '!животное':{ isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Animal', 'Animal', '🪳') },
    '!таракан': { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Upscream', 'Upscream', '😱') },

    // --- ВРАГИ (Сложность 3) ---
    '!невидимка':{ isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Hidden', 'Hidden', '🌫️') },
    '!жаба':     { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Tumbler', 'Tumbler', '🌀') },
    '!мишлен':   { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Bowtie', 'Bowtie', '🎀') },
    '!пришелец': { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Floater', 'Floater', '🎈') },
    '!рулетка':  { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Spinny', 'Spinny', '🌪️') },
    '!цветок':   { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Heart Hugger', 'HeartHugger', '❤️') },
    '!чорт':     { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Head Grabber', 'HeadGrabber', '🤚') },
    '!комар':    { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Oogly', 'Oogly', '👹') },
    '!дед':      { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Hunter', 'Hunter', '🏹') },
    // '!бабка':    { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Shadow', 'Shadow', '👤') },
    '!жвачка':   { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Bomb Thrower', 'BombThrower', '💣') },
    '!монашка':  { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Robe', 'Robe', '⛪') },
    '!кукла':    { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Runner', 'Runner', '🏃') },
    '!клоун':    { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Beamer', 'Beamer', '🔦') },
    '!череп':    { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Head', 'Headman', '💀') },
    '!демон':    { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'ru', 'Enemy - Slow Walker', 'Trudge', '👣') },
    
    // рандомный
    '!враг': { isSpawn: true, execute: (d, t, c) => core.randomEnemy(d, t, c, module.exports, '!враг') },
};