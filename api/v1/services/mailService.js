const sendMail = require('../../../init/mail');
const { generateAuthToken } = require('../middleware/auth');

const sendEmailConfirmation = async (user, req) => {
  try {
    const confirmEmailToken = await generateAuthToken(user._id);

    const confirmEmailURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/confirmemail?token=${confirmEmailToken}`;

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

    if (result.hasError) throw new Error();

    return { status: 'SUCCESS', hasError: false };
  } catch (e) {
    console.log(e);
    return { status: 'ERROR_FOUND', hasError: true };
  }
};

const resetPasswordLink = async (user) => {
  const mailConfig = {
    receiverMailAddress: user.email,
    configuration: {
      subject: 'Forget Password',
      text: 'Please use this link to reset your password',
    },
  };

  await sendMail(mailConfig);
};

module.exports = { sendEmailConfirmation, resetPasswordLink };