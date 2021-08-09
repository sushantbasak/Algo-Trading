'use strict';

require('dotenv').config();

const config = {
  development: {
    mongoDb: process.env.DB_URL,
    port: process.env.PORT || 3001,
    saltRound: process.env.SALTROUND,
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.EXPIRESIN,
    },
    homeMail: process.env.HOME_MAIL,
    homeMailPassword: process.env.HOME_MAIL_PASSWORD,
    emailServiceProvider: process.env.EMAIL_SERVICE_PROVIDER,
  },
};

const appSettings = { ...config[process.env.NODE_ENV || 'development'] };

module.exports = appSettings;
