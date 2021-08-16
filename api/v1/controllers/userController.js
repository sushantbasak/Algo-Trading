// Library

const router = require('express').Router();
const httpCode = require('http-status-codes');
const { celebrate } = require('celebrate');

// Services

const ErrorHandler = require('../../utils/errorHandler');
const userService = require('../services/userService');
const { MESSAGES } = require('../../../constants');

// Imports

const { generateAuthToken, protect } = require('../middleware/auth');
const { generateHash, compareHash, verifyHash } = require('../middleware/hash');
const { sendEmailConfirmation } = require('../services/mailService');
const { userSchema } = require('../validators/user.schema');
// Functions

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  const user = { name, email, password };

  try {
    const getHashedPassword = await generateHash(user.password);

    if (getHashedPassword.status === 'ERROR_FOUND')
      throw new Error('Unable to generate Hash of given password');

    user['password'] = getHashedPassword.hash;

    const registerUser = await userService.createUser(user);

    if (registerUser.status === 'ERROR_FOUND')
      throw new Error('Unable to create a new User in database');

    const sendMail = await sendEmailConfirmation(registerUser.result, req);

    if (sendMail.status === 'ERROR_FOUND')
      throw new Error('Unable to send Email Confirmation');

    res.sendSuccess(
      registerUser.result,
      MESSAGES.api.CREATED,
      httpCode.StatusCodes.CREATED
    );
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
    const generateToken = await generateAuthToken(req.user._id);

    if (generateToken.status === 'ERROR_FOUND')
      throw new Error('Unable to generate Authorization Token');

    res.sendSuccess(
      { token: generateToken.token },
      MESSAGES.api.SUCCESS,
      httpCode.StatusCodes.OK
    );
  } catch (ex) {
    ErrorHandler.extractError(ex);
    res.sendError(
      httpCode.StatusCodes.INTERNAL_SERVER_ERROR,
      MESSAGES.api.SOMETHING_WENT_WRONG
    );
  }
};

const getProfile = async (req, res) => {
  res.sendSuccess(req.user, MESSAGES.api.SUCCESS, httpCode.StatusCodes.OK);
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

      if (data === 'password' && req.body[data].length) {
        const password = req.body[data];

        const getSavedPassword = await userService.getPassword({
          _id: req.user._id,
        });

        if (getSavedPassword.status === 'ERROR_FOUND')
          throw new Error('Cannot Retrieve Password from Database');

        const Match = await verifyHash(
          getSavedPassword.result.password,
          password
        );

        if (Match.status === 'SUCCESS') continue;

        if (Match.status === 'ERROR_FOUND')
          throw new Error(
            'Internal Error Occured During Password Verification'
          );

        const getHashedPassword = await generateHash(password);

        if (getHashedPassword.status === 'ERROR_FOUND')
          throw new Error('Cannot generate Hashed Password');

        req.user[data] = getHashedPassword.hash;

        flag = true;
      } else if (req.body[data].length && req.body[data] !== req.user[data]) {
        req.user[data] = req.body[data];
        flag = true;
      }
    }

    if (!flag) {
      delete req.body.password;

      return res.sendSuccess(
        req.body,
        MESSAGES.api.NO_NEW_UPDATE,
        httpCode.StatusCodes.OK
      );
    }

    const updatedUser = await userService.updateUser(
      { _id: req.user._id },
      req.user
    );

    if (updatedUser.status === 'ERROR_FOUND')
      throw new Error('Unable to Update User in Database');

    res.sendSuccess(
      updatedUser.result,
      MESSAGES.api.UPDATE_SUCCESSFULL,
      httpCode.StatusCodes.OK
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

router.post(
  '/register',
  celebrate({
    body: userSchema,
  }),
  createUser
);

// router.post('/register', createUser);

router.post('/login', compareHash, loginUser);

router.get('/profile', protect, getProfile);

router.patch(
  '/update',
  protect,
  celebrate({
    body: userSchema,
  }),
  updateUser
);

router.get('/logout', logoutUser);

module.exports = router;
