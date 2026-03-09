// terminal.js
const readline = require('readline');

function initTerminal(deps, commandWrapper) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    console.log('[Terminal] ⌨️ Консольный ввод активирован. Можно писать команды прямо здесь.');

    rl.on('line', (line) => {
        const msg = line.trim();
        if (!msg) return;

        // Эмулируем контекст сообщения от стримера
        const fakeContext = {
            username: 'iagan3228', // Твой ник для тестов !reload и прочего
            'message-type': 'chat',
            id: 'console-' + Date.now(),
            mod: true // Чтобы проходить проверки на модератора
        };

        const target = '#iagan3228';
        const parts = msg.trim().split(/\s+/); 
        const commandName = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Доступ к актуальному списку команд через геттер в deps
        const currentCommands = deps.getCommands();

        if (currentCommands[commandName]) {
            console.log(`[Console -> Bot] Исполняю: ${commandName}`);
            // Прогоняем через тот же ворпер, что и реальный чат
            commandWrapper(deps, () => currentCommands[commandName].execute(deps, target, fakeContext, args), fakeContext, commandName);
        } else {
            console.log(`[Console] Команда "${commandName}" не найдена.`);
        }
    });
}

module.exports = { initTerminal };