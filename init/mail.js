const nodemailer = require('nodemailer');

const appSettings = require('../config/index');

const { homeMail, homeMailPassword, emailServiceProvider } = appSettings;

const sendMail = async ({ receiverMailAddress, configuration }) => {
  const transporter = nodemailer.createTransport({
    service: emailServiceProvider,
    auth: {
      user: homeMail,
      pass: homeMailPassword,
    },
  });

  const mailOptions = {
    from: homeMail,
    to: receiverMailAddress,
    ...configuration,
  };

  try {
    const response = await transporter.sendMail(mailOptions);

    console.log(response.response);

    return { status: 'SUCCESS ', hasError: false };
  } catch (e) {
    console.log(e);
    return { status: 'ERROR_FOUND', hasError: true };
  }
};

module.exports = sendMail;
