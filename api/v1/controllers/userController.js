const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { UNKNOWN_SERVER_ERROR } = require('../../../constants/http-codes');
const ErrorHandler = require('../../utils/errorHandler');
const userService = require('../services/userService');
const { MESSAGES } = require('../../../constants');
const { saveUserSchema } = require('../validators/user.schema');
const httpCode = require('http-status-codes');
const httpCodes = require('../../../constants/http-codes');
const { generateAuthToken, protect } = require('../middleware/auth');
const { generateHash, compareHash } = require('../middleware/hash');
const { sendEmailConfirmation } = require('../services/mailService');

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
    const user = req.body;

    user['password'] = await generateHash(user.password);

    let errorFound = true;

    const { status, result } = await userService.createUser(user);
    if (status === 'USER_CREATED') {
      const { hasError } = await sendEmailConfirmation(user, req);

      if (!hasError) errorFound = false;
    }

    if (!errorFound) {
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
  res.sendSuccess(req.user, MESSAGES.api.SUCCESS, httpCode.StatusCodes.SUCCESS);
};

const loginUser = async (req, res) => {
  try {
    const token = await generateAuthToken(req.user._id);

    res.sendSuccess(
      { token },
      MESSAGES.api.SUCCESS,
      httpCode.StatusCodes.SUCCESS
    );
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

router.post('/login', compareHash, loginUser);

router.post('/register', createUser);

router.get('/profile', protect, getProfile);

router.patch('/update', updateUser);

router.get('/logout', logoutUser);

module.exports = router;
