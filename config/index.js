'use strict';

const config = {
  development: {
    mongoDb: 'mongodb://127.0.0.1:27017/algo-trader-api',
    port: process.env.PORT || 3001,
    jwt: {
      secrets: 'What a drag, I need to set this too',
      expiresIn: 'a365asdfasd',
    },
  },
};

const appSettings = { ...config[process.env.NODE_ENV || 'development'] };

module.exports = appSettings;
