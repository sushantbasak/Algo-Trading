'use strict';
const appSettings = require('./config');
const middleware = require('./middleware');
const dotenv = require('dotenv');
dotenv.config();

middleware()
  .then((app) => app.listen(appSettings.port))
  .then(() => {
    console.log('Server started on port:', appSettings.port);
  })
  .catch((err) => {
    console.error('caught error', err);
  });
