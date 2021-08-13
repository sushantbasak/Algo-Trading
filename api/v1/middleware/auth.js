const jwt = require('jsonwebtoken');

const appSettings = require('../../../config/index');
const userService = require('../services/userService');
const ErrorHandler = require('../../utils/errorHandler');
const httpCode = require('http-status-codes');
const { MESSAGES } = require('../../../constants');
const url = require('url');

const {
  jwt: { secret, expiresIn },
} = appSettings;

const generateAuthToken = async (userId) => {
  const token = await jwt.sign(
    { id: userId, date: new Date().getTime() },
    secret
  );

  return token;
};

const protect = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    const decoded = await jwt.verify(token, secret);

    const { result, status } = await userService.findUser({
      _id: decoded.id,
    });

    if (status === 'ERROR_FOUND') {
      return res.sendError(
        httpCode.StatusCodes.BAD_REQUEST,
        MESSAGES.api.USER_NOT_FOUND
      );
    }

    if (result.isEmailConfirmed === false) {
      return res.sendError(
        httpCode.StatusCodes.OK,
        MESSAGES.api.EMAIL_NOT_CONFIRMATION
      );
    }

    req.user = result;

    next();
  } catch (ex) {
    ErrorHandler.extractError(ex);
    return res.sendError(
      httpCode.StatusCodes.UNAUTHORIZED,
      MESSAGES.api.UNAUTHORIZED_USER
    );
  }
};

const confirmAuthToken = async (req, res, next) => {
  try {
    const { token } = url.parse(req.url, true).query;

    const decoded = await jwt.verify(token, secret);

    req.user = {
      _id: decoded.id,
    };

    next();
  } catch (ex) {
    ErrorHandler.extractError(ex);
    return res.sendError(
      httpCode.StatusCodes.UNAUTHORIZED,
      MESSAGES.api.LINK_EXPIRED
    );
  }
};

module.exports = { generateAuthToken, protect, confirmAuthToken };
