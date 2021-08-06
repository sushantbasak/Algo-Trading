const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { UNKNOWN_SERVER_ERROR } = require('../../../constants/http-codes');
const ErrorHandler = require('../../utils/errorHandler');
const userService = require('../services/userService');
const { MESSAGES } = require('../../../constants');
const { saveUserSchema } = require('../validators/user.schema');
const httpCode = require('http-status-codes');
const { generateAuthToken, protect } = require('../middleware/auth');
const httpCodes = require('../../../constants/http-codes');

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

const getProfile = async (req, res) => {
  try {
    const { status, result } = await userService.findUser(req.body);
    if (status === 'USER_FOUND') {
      res.sendSuccess(
        result,
        MESSAGES.api.SUCCESS,
        httpCode.StatusCodes.SUCCESS
      );
    } else {
      res.sendError(
        httpCode.StatusCodes.BAD_REQUEST,
        MESSAGES.api.USER_NOT_FOUND
      );
    }
  } catch (ex) {
    ErrorHandler.extractError(ex);
    res.sendError(
      httpCode.StatusCodes.INTERNAL_SERVER_ERROR,
      MESSAGES.api.SOMETHING_WENT_WRONG
    );
  }
};

const loginUser = async (req, res) => {
  try {
    const { status, result } = await userService.findUser(req.body);
    if (status === 'USER_FOUND') {
      const token = await generateAuthToken(result._id);

      res.sendSuccess(
        { token },
        MESSAGES.api.SUCCESS,
        httpCode.StatusCodes.SUCCESS
      );
    } else {
      res.sendError(
        httpCode.StatusCodes.BAD_REQUEST,
        MESSAGES.api.USER_NOT_FOUND
      );
    }
  } catch (ex) {
    ErrorHandler.extractError(ex);
    res.sendError(
      httpCode.StatusCodes.INTERNAL_SERVER_ERROR,
      MESSAGES.api.SOMETHING_WENT_WRONG
    );
  }
};

const logoutUser = (req, res) => {
  res.send('Logout User');
};

const updateUser = (req, res) => {
  res.send('User Updated');
};

// Define all the user route here
router.put(
  '/save',
  celebrate({
    body: saveUserSchema,
  }),
  saveUser
);

router.post('/login', loginUser);

router.post('/register', createUser);

router.get('/profile', protect, getProfile);

router.patch('/update', updateUser);

router.get('/logout', logoutUser);

module.exports = router;
