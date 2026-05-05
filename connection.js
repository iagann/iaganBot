// connection.js
const tmi = require('tmi.js');
require('dotenv').config();

const opts = {
    identity: {
        username: 'iaganbot',
        password: process.env.TWITCH_OAUTH_TOKEN
    },
    channels: ['iagan3228', 'tekkenking64', 'yanva___', 'doggy_dox', 'fapprika']
};

const client = new tmi.client(opts);

module.exports = { client, opts };