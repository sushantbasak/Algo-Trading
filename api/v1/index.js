'use strict';

const router = require('express').Router();

router.use('/user', require('./controllers/userController'));

module.exports = router;
