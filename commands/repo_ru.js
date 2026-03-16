const { core } = require('./repo_logic');

module.exports = {
    // --- ОБЩИЕ КОМАНДЫ ---
    '!прыжок': { execute: (d, t, c) => core.jump(d, t, c, 'ru') },
    '!хоп':    { execute: (d, t, c) => core.jump(d, t, c, 'ru') },
    '!прыгать': { execute: (d, t, c) => core.jumps(d, t, c, 'ru') },
    '!лети': { execute: (d, t, c, a) => core.pushUp(d, t, c, 'ru', a) },
    '!сидеть': { execute: (d, t, c) => core.crouch(d, t, c, 'ru') },
    '!гуськом':{ execute: (d, t, c) => core.crouch(d, t, c, 'ru') },

    // --- СТАТУСЫ И ХП ---
    '!бог':      { execute: (d, t, c) => core.god(d, t, c, 'ru', true) },
    '!смертный': { execute: (d, t, c) => core.god(d, t, c, 'ru', false) },
    '!атлет':      { execute: (d, t, c) => core.stamina(d, t, c, 'ru', true) },
    '!дрыщ':      { execute: (d, t, c) => core.stamina(d, t, c, 'ru', false) },
    '!хил':      { execute: (d, t, c, a) => core.health(d, t, c, 'ru', 'heal', a) },
    '!урон':     { execute: (d, t, c, a) => core.health(d, t, c, 'ru', 'damage', a) },

    '!враг': { isSpawn: true, execute: (d, t, c) => core.randomEnemy(d, t, c, module.exports, '!враг') },
    // --- ВРАГИ (Сложность 1) ---
    '!пёс':    { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Elsa', 'Elsa', '🐶', a, 50) },
    '!велик':  { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Tricycle', 'Tricycle', '🚲', a, 50) },
    '!пацан':  { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Birthday boy', 'Birthday', '🎂', a, 50) },
    '!клещ':   { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Tick', 'Tick', '🕷️', a, 50) },
    '!блевота':{ isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Slow Mouth', 'SlowMouth', '👄', a, 50) },

    // --- ВРАГИ (Сложность 2) ---
    '!слендер': { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Thin Man', 'ThinMan', '👤', a, 50) },
    '!утка':    { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Duck', 'Duck', '🦆', a, 50) },
    '!мелкий':  { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Valuable Thrower', 'Thrower', '👶', a, 50) },
    '!животное':{ isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Animal', 'Animal', '🪳', a, 50) },
    '!таракан': { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Upscream', 'Upscream', '😱', a, 50) },

    // --- ВРАГИ (Сложность 3) ---
    '!невидимка':{ isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Hidden', 'Hidden', '🌫️', a, 50) },
    '!жаба':     { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Tumbler', 'Tumbler', '🌀', a, 50) },
    '!мишлен':   { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Bowtie', 'Bowtie', '🎀', a, 50) },
    '!пришелец': { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Floater', 'Floater', '🎈', a, 50) },
    '!рулетка':  { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Spinny', 'Spinny', '🌪️', a, 50) },
    '!цветок':   { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Heart Hugger', 'HeartHugger', '❤️', a, 50) },
    '!чорт':     { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Head Grabber', 'HeadGrabber', '🤚', a, 50) },
    '!комар':    { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Oogly', 'Oogly', '👹', a, 50) },
    '!дед':      { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Hunter', 'Hunter', '🏹', a, 50) },
    '!бабка':    { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Shadow', 'Shadow', '👤', a, 10) },
    '!жвачка':   { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Bomb Thrower', 'BombThrower', '💣', a, 50) },
    '!монашка':  { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Robe', 'Robe', '⛪', a, 50) },
    '!кукла':    { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Runner', 'Runner', '🏃', a, 50) },
    '!клоун':    { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Beamer', 'Beamer', '🔦', a, 50) },
    '!череп':    { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Head', 'Headman', '💀', a, 50) },
    '!демон':    { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Slow Walker', 'Trudge', '👣', a, 50) },

    '!таймер': { admin: true, execute: (d, t, c, a) => core.setLifespan(d, t, c, 'ru', a) },
};