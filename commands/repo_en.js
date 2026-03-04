const { core } = require('./repo_logic');

module.exports = {
    // --- General Commands ---
    '!jump': { execute: (d, t, c) => core.jump(d, t, c, 'en') },
    '!fly': { execute: (d, t, c, a) => core.pushUp(d, t, c, 'en', a) },
    '!crouch': { execute: (d, t, c) => core.crouch(d, t, c, 'en') },

    // --- Stats & HP ---
    '!god':    { execute: (d, t, c) => core.god(d, t, c, 'en', true) },
    '!mortal': { execute: (d, t, c) => core.god(d, t, c, 'en', false) },
    '!heal':   { execute: (d, t, c, a) => core.health(d, t, c, 'en', 'heal', a) },
    '!damage': { execute: (d, t, c, a) => core.health(d, t, c, 'en', 'damage', a) },

    // --- Enemies Difficulty 1 ---
    '!elsa':     { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Elsa', 'Elsa', '👻') },
    '!tricycle': { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Tricycle', 'Tricycle', '🚲') },
    '!birthday': { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Birthday boy', 'Birthday', '🎂') },
    '!tick':     { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Tick', 'Tick', '🕷️') },
    '!mouth':    { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Slow Mouth', 'SlowMouth', '👄') },

    // --- Enemies Difficulty 2 ---
    '!thinman':  { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Thin Man', 'ThinMan', '👤') },
    '!duck':     { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Duck', 'Duck', '🦆') },
    '!thrower':  { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Valuable Thrower', 'Thrower', '👶') },
    '!animal':   { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Animal', 'Animal', '🪳') },
    '!upscream': { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Upscream', 'Upscream', '😱') },

    // --- Enemies Difficulty 3 ---
    '!hidden':   { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Hidden', 'Hidden', '🌫️') },
    '!tumbler':  { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Tumbler', 'Tumbler', '🌀') },
    '!bowtie':   { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Bowtie', 'Bowtie', '🎀') },
    '!floater':  { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Floater', 'Floater', '🎈') },
    '!spinny':   { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Spinny', 'Spinny', '🌪️') },
    '!hugger':   { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Heart Hugger', 'HeartHugger', '❤️') },
    '!grabber':  { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Head Grabber', 'HeadGrabber', '🤚') },
    '!oogly':    { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Oogly', 'Oogly', '👹') },
    '!hunter':   { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Hunter', 'Hunter', '🏹') },
    '!shadow':   { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Shadow', 'Shadow', '👤') },
    '!bomber':   { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Bomb Thrower', 'BombThrower', '💣') },
    '!robe':     { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Robe', 'Robe', '⛪') },
    '!runner':   { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Runner', 'Runner', '🏃') },
    '!beamer':   { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Beamer', 'Beamer', '🔦') },
    '!headman':  { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Head', 'Headman', '💀') },
    '!trudge':   { isSpawn: true, execute: (d, t, c) => core.spawn(d, t, c, 'en', 'Enemy - Slow Walker', 'Trudge', '👣') },

    // random
    '!enemy': { isSpawn: true, execute: (d, t, c) => core.randomEnemy(d, t, c, module.exports, '!enemy') },

    '!lifespan': { admin: true, execute: (d, t, c, a) => core.setLifespan(d, t, c, 'en', a) },
};