'use strict';

require('dotenv').config();

const config = {
  development: {
    mongoDb: process.env.DB_URL,
    port: process.env.PORT || 3001,
    jwt: {
      secrets: 'What a drag, I need to set this too',
      expiresIn: 'a365asdfasd',
    },
  },
};

const appSettings = { ...config[process.env.NODE_ENV || 'development'] };

module.exports = appSettings;
