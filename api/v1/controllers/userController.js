const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { UNKNOWN_SERVER_ERROR } = require('../../../constants/http-codes');
const ErrorHandler = require('../../utils/errorHandler');
const userService = require('../services/userService');
const { MESSAGES } = require('../../../constants');
const { saveUserSchema } = require('../validators/user.schema');
const httpCode = require('http-status-codes');

const saveUser = async (req, res) => {
  try {
    const { status, result } = await userService.saveUser(req.body);
    if (status === 'USER_SAVED') {
      res.sendSuccess(result, MESSAGES.api.SUCCESS, httpCode.StatusCodes.OK);
    } else {
      res.sendError(UNKNOWN_SERVER_ERROR, MESSAGES.api.SOMETHING_WENT_WRONG);
    }
  } catch (ex) {
    ErrorHandler.extractError(ex);
    res.sendError(
      httpCode.StatusCodes.INTERNAL_SERVER_ERROR,
      MESSAGES.api.SOMETHING_WENT_WRONG
    );
  }
};

const createUser = async (req, res) => {
  try {
    const { status, result } = await userService.createUser(req.body);
    if (status === 'USER_CREATED') {
      res.sendSuccess(
        result,
        MESSAGES.api.CREATED,
        httpCode.StatusCodes.CREATED
      );
    } else {
      res.sendError(UNKNOWN_SERVER_ERROR, MESSAGES.api.SOMETHING_WENT_WRONG);
    }
  } catch (ex) {
    ErrorHandler.extractError(ex);
    res.sendError(
      httpCode.StatusCodes.INTERNAL_SERVER_ERROR,
      MESSAGES.api.SOMETHING_WENT_WRONG
    );
  }
};

const findUser = async (req, res) => {
  try {
    const { status, result } = await userService.findUser(req.body);
    if (status === 'USER_FOUND') {
      res.sendSuccess(
        result,
        MESSAGES.api.SUCCESS,
        httpCode.StatusCodes.SUCCESS
      );
    } else {
      res.sendError(UNKNOWN_SERVER_ERROR, MESSAGES.api.SOMETHING_WENT_WRONG);
    }
  } catch (ex) {
    ErrorHandler.extractError(ex);
    res.sendError(
      httpCode.StatusCodes.INTERNAL_SERVER_ERROR,
      MESSAGES.api.SOMETHING_WENT_WRONG
    );
  }
};

const loginUser = (req, res) => {
  res.send('HELLO');
};

// Define all the user route here
router.put(
  '/save',
  celebrate({
    body: saveUserSchema,
  }),
  saveUser
);

router.get('/login', loginUser);

router.post('/register', createUser);

router.post('/profile', findUser);

module.exports = router;
