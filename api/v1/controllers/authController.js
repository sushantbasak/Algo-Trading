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

const confirmEmail = async (req, res) => {
  try {
    const updatedValues = {
      isEmailConfirmed: true,
    };

    const { status } = await userService.updateUser(req.user, updatedValues);

    if (status === 'ERROR_FOUND') {
      res.sendError(
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

// Define all the user route here

router.get('/confirmemail', confirmEmailToken, confirmEmail);

module.exports = router;
