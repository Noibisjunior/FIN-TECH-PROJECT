const nodemailer = require('nodemailer');
const Auth = require('../models/auth')

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendEmail = async (to, subject, text) => {
    const { email } = req.body;
    const user = await Auth.findOne({ email });
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to:user.email,
      subject,
      text
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
