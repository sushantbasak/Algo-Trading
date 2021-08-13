const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { UNKNOWN_SERVER_ERROR } = require('../../../constants/http-codes');
const ErrorHandler = require('../../utils/errorHandler');
const userService = require('../services/userService');
const { MESSAGES } = require('../../../constants');
const { saveUserSchema } = require('../validators/user.schema');
const httpCode = require('http-status-codes');
const httpCodes = require('../../../constants/http-codes');
const { confirmEmailToken } = require('../middleware/auth');
const { sendResetPasswordLink } = require('../services/mailService');
const url = require('url');

const confirmEmail = async (req, res) => {
  try {
    const updatedValues = {
      isEmailConfirmed: true,
    };

    const { status } = await userService.updateUser(req.user, updatedValues);

    if (status === 'ERROR_FOUND') {
      return res.sendError(
        httpCode.StatusCodes.INTERNAL_SERVER_ERROR,
        MESSAGES.api.UPDATE_UNSUCCESSFULL
      );
    }

    res.sendSuccess(
      MESSAGES.api.EMAIL_VERIFICATION_SUCCESSFULL,
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

const forgetPassword = async (req, res) => {
  const { email } = url.parse(req.url, true).query;

  try {
    if (email === undefined) {
      return res.sendError(
        httpCode.StatusCodes.BAD_REQUEST,
        MESSAGES.api.MISSING_QUERY_PARAMETER
      );
    }

    const { status, result } = await userService.findUser({ email });

    if (status === 'ERROR_FOUND') {
      return res.sendError(
        httpCode.StatusCodes.BAD_REQUEST,
        MESSAGES.api.USER_NOT_FOUND
      );
    }

    const updatedData = await userService.updateUser(
      { _id: result._id },
      { isPasswordReset: true }
    );

    if (updatedData.hasError) throw new Error();

    const sendEmail = await sendResetPasswordLink(updatedData.result, req);

    if (sendEmail.hasError) throw new Error();

    res.sendSuccess(MESSAGES.api.PASSWORD_RESET_LINK, httpCode.StatusCodes.OK);
  } catch (ex) {
    ErrorHandler.extractError(ex);
    res.sendError(
      httpCode.StatusCodes.INTERNAL_SERVER_ERROR,
      MESSAGES.api.SOMETHING_WENT_WRONG
    );
  }
};

const resetPassword = (req, res) => {
  res.send('Long time no see !');
};

// Define all the user route here

router.get('/confirmemail', confirmEmailToken, confirmEmail);

router.get('/forgetpassword', forgetPassword);

router.post('/reset', resetPassword);

module.exports = router;
