'use strict';

require('dotenv').config();

const config = {
  development: {
    mongoDb: process.env.DB_URL,
    port: process.env.PORT || 3001,
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.EXPIRESIN,
    },
  },
};

const appSettings = { ...config[process.env.NODE_ENV || 'development'] };

module.exports = appSettings;
