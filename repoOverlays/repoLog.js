const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});
const axios = require('axios');
const path = require('path');

const GAME_SERVER_URL = "http://127.0.0.1:13337/logs";
const POLL_INTERVAL = 500; // Опрос игры дважды в секунду

module.exports = {
    init: function() {
        // Раздаем HTML файл оверлея
        app.get('/repoLog', (req, res) => {
            res.sendFile(path.join(__dirname, 'repoLog.html'));
        });

        // Логика опроса игры
        setInterval(async () => {
            try {
                const response = await axios.get(GAME_SERVER_URL, { timeout: 400 });
                
                if (response.data && response.data.trim().length > 0) {
                    // Если в ответе есть текст, шлем его в сокеты
                    io.emit('logUpdate', response.data);
                }
            } catch (err) {
                // Ошибка обычно означает, что игра просто еще не запущена
                // console.log("Игра не отвечает...");
            }
        }, POLL_INTERVAL);

        io.on('connection', (socket) => {
            console.log('\x1b[36m%s\x1b[0m', '[REPO] OBS подключился к оверлею c логами');
        });

        http.listen(3005, () => {
            console.log('\x1b[32m%s\x1b[0m', `[REPO] Сервер оверлея запущен: http://localhost:3005/overlay`);
        });
    }
};