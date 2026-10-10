
// controllers/shareController.js
const nodemailer = require('nodemailer');

// Generate Shareable Link
exports.generateShareLink = (req, res) => {
    const { type, id } = req.params;

    // Define the base URL for the frontend
    const baseUrl = `http://localhost:3000`; // Replace with actual frontend URL if different
    const shareableLink = `${baseUrl}/share/${type}/${id}`;

    res.json({ link: shareableLink });
};

// Send Email with Shareable Link
exports.sendShareEmail = async (req, res) => {
    const { email, link } = req.body;

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Check out this link!',
        text: `Here’s something you might find interesting: ${link}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error("Error sending email:", error);  // Log the full error
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }


    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

};
