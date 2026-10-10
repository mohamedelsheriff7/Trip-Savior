const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Email from environment variable
      pass: process.env.EMAIL_PASS,  // App-specific password from environment variable
    },
  });

  const mailOptions = {
    from: "bopw2003@gmail.com", // Sender address
    to, // Recipient's email
    subject, // Subject line
    text, // Plain text body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error;
  }
};

module.exports = sendEmail;
