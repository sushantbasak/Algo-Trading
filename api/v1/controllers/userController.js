const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { UNKNOWN_SERVER_ERROR } = require('../../../constants/http-codes');
const ErrorHandler = require('../../utils/errorHandler');
const userService = require('../services/userService');
const { MESSAGES } = require('../../../constants');
const { saveUserSchema } = require('../validators/user.schema');
const httpCode = require('http-status-codes');

constsaveUser = async (req, res) => {
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

// Define all the user route here
router.put(
  '/save',
  celebrate({
    body: saveUserSchema,
  }),
  saveUser
);

module.exports = router;
