'use strict';

const config = {
  development: {
    mongoDb: 'mongodb+srv://etcetc',
    port: process.env.PORT || 8001,
    jwt: {
      secrets: 'Nothingspecialyouwanttoreveal',
      expiresIn: 'a365asdfasd',
    },
  },
};

const appSettings = { ...config[process.env.NODE_ENV || 'development'] };

module.exports = appSettings;
