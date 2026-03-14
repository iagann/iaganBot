const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const axios = require('axios');
const path = require('path');

const DEATH_API_URL = "http://127.0.0.1:13337/deaths";
const POLL_INTERVAL = 1000; // Опрос раз в секунду

module.exports = {
    init: function() {
        app.get('/deaths', (req, res) => {
            res.sendFile(path.join(__dirname, 'deathOverlay.html'));
        });

        setInterval(async () => {
            try {
                const response = await axios.get(DEATH_API_URL, { timeout: 800 });
                // Отправляем число смертей всем подключенным оверлеям
                io.emit('deathUpdate', response.data);
            } catch (err) {
                // Если игра закрыта, ошибок в консоль не сыплем
            }
        }, POLL_INTERVAL);

        http.listen(3007, () => {
            console.log('[REPO-DEATHS] Оверлей смертей: http://localhost:3007/deaths');
        });
    }
};