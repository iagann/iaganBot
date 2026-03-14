const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const path = require('path');

let socketInstance = null;

module.exports = {
    init: function() {
        app.get('/repoCooldowns', (req, res) => {
            res.sendFile(path.join(__dirname, 'cooldownOverlay.html'));
        });

        io.on('connection', (socket) => {
            socketInstance = socket;
            console.log('\x1b[36m%s\x1b[0m', '[REPO-CD] Оверлей кулдаунов подключен');
        });

        http.listen(3006, () => {
            console.log('[REPO-CD] Сервер кулдаунов: http://localhost:3006/repoCooldowns');
        });
    },
    // Функция, которую будет вызывать бот
    emit: (event, data) => {
        io.emit(event, data);
    }
};