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
    '!пёс':    { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Elsa', 'Elsa', '🐶', a, 10) },
    '!велик':  { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Tricycle', 'Tricycle', '🚲', a, 10) },
    '!пацан':  { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Birthday boy', 'Birthday', '🎂', a, 10) },
    '!клещ':   { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Tick', 'Tick', '🕷️', a, 10) },
    '!блевота':{ isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Slow Mouth', 'SlowMouth', '👄', a, 10) },

    // --- ВРАГИ (Сложность 2) ---
    '!слендер': { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Thin Man', 'ThinMan', '👤', a, 10) },
    '!утка':    { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Duck', 'Duck', '🦆', a, 10) },
    '!мелкий':  { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Valuable Thrower', 'Thrower', '👶', a, 10) },
    '!животное':{ isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Animal', 'Animal', '🪳', a, 10) },
    '!таракан': { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Upscream', 'Upscream', '😱', a, 10) },

    // --- ВРАГИ (Сложность 3) ---
    '!невидимка':{ isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Hidden', 'Hidden', '🌫️', a, 10) },
    '!жаба':     { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Tumbler', 'Tumbler', '🌀', a, 10) },
    '!мишлен':   { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Bowtie', 'Bowtie', '🎀', a, 10) },
    '!пришелец': { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Floater', 'Floater', '🎈', a, 10) },
    '!рулетка':  { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Spinny', 'Spinny', '🌪️', a, 10) },
    '!цветок':   { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Heart Hugger', 'HeartHugger', '❤️', a, 10) },
    '!чорт':     { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Head Grabber', 'HeadGrabber', '🤚', a, 10) },
    '!комар':    { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Oogly', 'Oogly', '👹', a, 3) },
    '!дед':      { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Hunter', 'Hunter', '🏹', a, 1) },
    '!бабка':    { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Shadow', 'Shadow', '👤', a, 10) },
    '!жвачка':   { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Bomb Thrower', 'BombThrower', '💣', a, 1) },
    '!монашка':  { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Robe', 'Robe', '⛪', a, 1) },
    '!кукла':    { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Runner', 'Runner', '🏃', a, 10) },
    '!клоун':    { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Beamer', 'Beamer', '🔦', a, 10) },
    '!череп':    { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Head', 'Headman', '💀', a, 1) },
    '!демон':    { isSpawn: true, execute: (d, t, c, a) => core.spawn(d, t, c, 'ru', 'Enemy - Slow Walker', 'Trudge', '👣', a, 10) },

    '!таймер': { admin: true, execute: (d, t, c, a) => core.setLifespan(d, t, c, 'ru', a) },
};