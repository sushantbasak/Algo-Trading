// Library

const jwt = require('jsonwebtoken');
const httpCode = require('http-status-codes');
const url = require('url');

// Services

const appSettings = require('../../../config/index');
const ErrorHandler = require('../../utils/errorHandler');
const { MESSAGES } = require('../../../constants');
const {
  jwt: { secret, expiresIn, resetsecret, resetexpiresIn },
} = appSettings;

// Imports

const userService = require('../services/userService');

// Functions

const generateAuthToken = async (userId, expiry = false) => {
  try {
    let expiryTime = expiresIn,
      secretValue = secret;

    if (expiry) {
      expiryTime = resetexpiresIn;

      secretValue = resetsecret;
    }

    const token = await jwt.sign(
      { id: userId, date: new Date().getTime() },
      secretValue,
      { expiresIn: expiryTime }
    );

    return { status: 'SUCCESS', token };
  } catch (ex) {
    ErrorHandler.extractError(ex);
    return { status: 'ERROR_FOUND' };
  }
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

    const pathname = url.parse(req.url, true).pathname;

    if (token === undefined) {
      return res.sendError(
        httpCode.StatusCodes.BAD_REQUEST,
        MESSAGES.api.MISSING_QUERY_PARAMETER
      );
    }

    let secretValue = resetsecret;

    if (pathname === '/confirmemail') {
      secretValue = secret;
    }

    const decoded = await jwt.verify(token, secretValue);

    const { result, status } = await userService.findUser({
      _id: decoded.id,
    });

    if (status === 'ERROR_FOUND') {
      return res.sendError(
        httpCode.StatusCodes.BAD_REQUEST,
        MESSAGES.api.USER_NOT_FOUND
      );
    }

    req.user = result;

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
