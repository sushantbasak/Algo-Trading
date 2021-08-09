const nodemailer = require('nodemailer');

const appSettings = require('../config/index');

const { homeMail, homeMailPassword, emailServiceProvider } = appSettings;

const sendMail = async ({ receiverMailAddress, subject, message }) => {
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
    subject,
    text: message,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendMail;
