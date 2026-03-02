// commands.js
const fs = require('fs');
const path = require('path');

function loadCommands() {
    let allCommands = {};
    const commandsPath = path.join(__dirname, 'commands');

    delete require.cache[require.resolve('./config')];
    const config = require('./config');
    
    if (!fs.existsSync(commandsPath)) return {};

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        if (file === 'repo.js' && !config.repoEnabled) {
            console.log(`[Loader] Пропускаю ${file}, так как R.E.P.O. выключен в конфиге.`);
            continue;
        }
        
        const filePath = path.join(commandsPath, file);
        
        // Чистим кэш
        delete require.cache[require.resolve(filePath)];
        
        // Загружаем объект из файла (например, из general.js)
        const fileExport = require(filePath);
        
        const countBefore = Object.keys(allCommands).length;
        for (const [key, value] of Object.entries(fileExport)) {
            if (key.startsWith('!')) {
                allCommands[key] = value;
            }
        }
        const countAfter = Object.keys(allCommands).length;
        const added = countAfter - countBefore;
        console.log(`[Loader] ✅ Файл загружен: ${file} (${added} команды)`);
    }
    
    console.log(`[Loader] Загружено команд: ${Object.keys(allCommands).length}`);
    return allCommands;
}

module.exports = { loadCommands };