// Services

const ErrorHandler = require('../../utils/errorHandler');

// Imports

const sendMail = require('../../../init/mail');
const { generateAuthToken } = require('../middleware/auth');

// Functions

const sendEmailConfirmation = async (user, req) => {
  try {
    const confirmEmailToken = await generateAuthToken(user._id);

    if (confirmEmailToken.status === 'ERROR_FOUND')
      throw new Error('Unable to generate Auth Token');

    const confirmEmailURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/confirmemail?token=${confirmEmailToken.token}`;

    const message = `You are receiving this email because you need to confirm your email address. <br/>
    Please Click on this link to Activate: <a href= ${confirmEmailURL}>Link</a>`;

    const mailConfig = {
      receiverMailAddress: user.email,
      configuration: {
        subject: 'Register User',
        html: message,
      },
    };

    const result = await sendMail(mailConfig);

    if (result.hasError)
      throw new Error('Unable to send Email Confirmation Mail');

    return { status: 'SUCCESS' };
  } catch (ex) {
    ErrorHandler.extractError(ex);
    return { status: 'ERROR_FOUND' };
  }
};

const sendResetPasswordLink = async (user, req) => {
  try {
    const resetPasswordToken = await generateAuthToken(user._id, true);

    if (resetPasswordToken.status === 'ERROR_FOUND')
      throw new Error('Unable to generate Auth Token');

    const resetPasswordLink = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/reset?token=${resetPasswordToken.token}`;

    const message = `You are receiving this email because you requested for Password Update. <br/>
    Please Click on this link to generate New Password: <a href= ${resetPasswordLink}>Link</a>`;

    const mailConfig = {
      receiverMailAddress: user.email,
      configuration: {
        subject: 'Password Reset',
        html: message,
      },
    };

    const result = await sendMail(mailConfig);

    if (result.hasError) throw new Error();

    return { status: 'SUCCESS' };
  } catch (ex) {
    ErrorHandler.extractError(ex);
    return { status: 'ERROR_FOUND' };
  }
};

module.exports = { sendEmailConfirmation, sendResetPasswordLink };
