const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const path = require('path');

let socketInstance = null;
const PORT = 3011;

module.exports = {
    init: function() {
        app.get('/neuroSync', (req, res) => {
            res.sendFile(path.join(__dirname, 'neuroOverlay.html'));
        });

        io.on('connection', (socket) => {
            socketInstance = socket;
            console.log('\x1b[33m%s\x1b[0m', '[NEURO] Интерфейс синхронизации подключен');
        });

        http.listen(PORT, () => {
            console.log(`[NEURO] HUD синхронизации: http://localhost:${PORT}/neuroSync`);
        });
    },
    // Вызывай это из своего обработчика нейронки
    emit: (event, data) => {
        if (event === 'aiStatus') {
            lastAiStatus = data.connected; // Запоминаем статус
        }
        io.emit(event, data);
    }
};