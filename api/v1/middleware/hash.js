const bcrypt = require('bcryptjs');
const appSettings = require('../../../config/index');

const generateHash = async (password) => {
  const hash = await bcrypt.hash(password, +appSettings.round);

  return hash;
};

const compareHash = async (req, res, next) => {
  console.log('Hello');

  next();
};

module.exports = { generateHash, compareHash };
