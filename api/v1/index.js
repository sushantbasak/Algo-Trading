'use strict';

const router = require('express').Router();

router.use('/user', require('./controllers/userController'));

router.get('/health', (req, res) => {
  res.send({ status: 'UP' });
});

module.exports = router;
