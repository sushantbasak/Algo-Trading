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
      const { hasError } = await sendEmailConfirmation(result, req);

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

const updateUser = async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ['name', 'email', 'password'];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.sendError(
      httpCode.StatusCodes.BAD_REQUEST,
      MESSAGES.validations.INVALID_UPDATE
    );

  try {
    let flag = false;

    for (let i = 0; i < updates.length; i++) {
      let data = updates[i];

      // if (data === 'password') {
      //   req.body[data] = await generateHash(req.body[data]);

      //   const { result, hasError } = await userService.getPassword(req.user);

      //   if (hasError) throw new Error();

      //   console.log(result.password, ' \n', req.body[data]);

      //   if (result.password !== req.body[data]) flag = true;

      //   console.log(flag);
      // }

      if (
        req.body[data].length &&
        data !== 'password' &&
        req.body[data] !== req.user[data]
      )
        flag = true;

      req.user[data] = req.body[data];
    }

    if (!flag) {
      res.sendSuccess(
        req.body,
        MESSAGES.api.NO_NEW_UPDATE,
        httpCode.StatusCodes.SUCCESS
      );
    }

    const { result, hasError } = await userService.updateUser(
      { _id: req.user._id },
      req.user
    );

    if (hasError) {
      return res.sendError(
        httpCode.StatusCodes.INTERNAL_SERVER_ERROR,
        MESSAGES.api.UPDATE_UNSUCCESSFULL
      );
    }

    res.sendSuccess(
      result,
      MESSAGES.api.UPDATE_SUCCESSFULL,
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

router.patch('/update', protect, updateUser);

router.get('/logout', logoutUser);

module.exports = router;
