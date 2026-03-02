const activeWin = require('active-win');

/**
 * Проверяет, является ли окно с указанным заголовком активным.
 */
async function isGameActive(targetTitle) {
    try {
        const window = await activeWin();
        if (!window || !window.title) return false;
        
        return window.title.toLowerCase().includes(targetTitle.toLowerCase());
    } catch (err) {
        console.error("[Window Error]:", err.message);
        return false;
    }
}

module.exports = { isGameActive };