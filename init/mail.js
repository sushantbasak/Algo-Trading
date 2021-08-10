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

  // const result = await transporter.sendMail(
  //   mailOptions,
  //   function (error, info) {
  //     if (error) {
  //       console.log(error);
  //       return { status: 'ERROR_FOUND', hasError: true };
  //     } else {
  //       console.log('Email sent: ' + info.response);

  //       return { status: 'SUCCESS ', hasError: false };
  //     }
  //   }
  // );

  // return result;

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
