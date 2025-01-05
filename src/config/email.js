const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   host: 'smtp.mailtrap.io',
//   port: 587,
//   auth: {
//     user: 'your-mailtrap-user',
//     pass: 'your-mailtrap-password'
//   }
// });

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  

const sendConfirmationEmail = async (to, subject, text) => {
  const info = await transporter.sendMail({
    from: 'lequiz24@gmail.com', 
    to,
    subject,
    text,
  });
  console.log('Message sent: %s', info.messageId);
};

module.exports = { sendConfirmationEmail };
