const bcrypt = require('bcryptjs');
const appSettings = require('../../../config/index');
const userService = require('../services/userService');
const ErrorHandler = require('../../utils/errorHandler');
const httpCode = require('http-status-codes');
const { MESSAGES } = require('../../../constants');

const generateHash = async (password) => {
  const hash = await bcrypt.hash(password, +appSettings.round);

  return hash;
};

const compareHash = async (req, res, next) => {
  try {
    const { result, status } = await userService.getPassword({
      email: req.body.email,
    });

    if (status === 'ERROR_FOUND') {
      return res.sendError(
        httpCode.StatusCodes.BAD_REQUEST,
        MESSAGES.api.USER_NOT_FOUND
      );
    }

    const isMatch = await bcrypt.compare(req.body.password, result.password);

    if (!isMatch) throw new Error();

    req.user = { _id: result._id };

    next();
  } catch (ex) {
    ErrorHandler.extractError(ex);
    res.sendError(
      httpCode.StatusCodes.BAD_REQUEST,
      MESSAGES.api.INVALID_CREDENTIALS
    );
  }
};

module.exports = { generateHash, compareHash };
