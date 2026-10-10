require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const router = express.Router();

// Temporary in-memory store for OTPs (use a database in production)
const otpStore = {};

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Email from environment variable
    pass: process.env.EMAIL_PASS,  // App-specific password from environment variable
  },
});

// Send OTP endpoint
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format.' });
  }

  // Generate a random 4-digit OTP
  const otp = crypto.randomInt(1000, 9999);

  // Store the OTP with a short expiration time (e.g., 5 minutes)
  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  };

  try {
    // Send the OTP via email
    await transporter.sendMail({
      from: `"Trip Saviour" <${process.env.EMAIL_USER}>`, // Sender address
      to: email, // Recipient's email
      subject: 'Your OTP Code', // Subject line
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`, // Plain text body
    });

    res.status(200).json({ success: true, message: 'OTP sent to email.' });
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.code === 'EAUTH') {
      return res.status(500).json({ success: false, message: 'Authentication error with email provider.' });
    }
    res.status(500).json({ success: false, message: 'Failed to send OTP.' });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Both email and OTP are required.' });
  }

  // Check if the OTP exists and has not expired
  const record = otpStore[email];
  if (!record) {
    return res.status(404).json({ success: false, message: 'OTP not found or expired.' });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[email]; // Remove expired OTP
    return res.status(400).json({ success: false, message: 'OTP has expired.' });
  }

  if (parseInt(otp, 10) !== record.otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP.' });
  }

  // OTP is valid
  delete otpStore[email]; // Clean up after successful verification
  res.status(200).json({ success: true, message: 'OTP verified successfully.' });
});

// Set up a cleanup interval to remove expired OTPs every minute
setInterval(() => {
  for (const email in otpStore) {
    if (otpStore[email].expiresAt < Date.now()) {
      delete otpStore[email]; // Remove expired OTP
    }
  }
}, 60 * 1000); // Run every minute

module.exports = router;
