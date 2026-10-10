const PromoCode = require("../models/PromoCode");
const Tourist = require("../models/Tourist");
const nodemailer = require("nodemailer");

// Create a new promo code
exports.createPromoCode = async (req, res) => {
  try {
    const { code, discount, expiryDate, usageLimit } = req.body;

    // Validate inputs
    if (!code || !discount || !expiryDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the promo code already exists
    const existingPromoCode = await PromoCode.findOne({ code });
    if (existingPromoCode) {
      return res.status(400).json({ message: "Promo code already exists." });
    }

    // Create and save the promo code
    const promoCode = new PromoCode({
      code,
      discount,
      expiryDate,
      usageLimit,
    });
    await promoCode.save();

    res
      .status(201)
      .json({ message: "Promo code created successfully.", promoCode });
    res
      .status(201)
      .json({ message: "Promo code created successfully.", promoCode });
  } catch (error) {
    res.status(500).json({ message: "Error creating promo code.", error });
  }
};

// New Function: Send Birthday Promo Codes
exports.sendBirthdayPromoCodes = async (req, res) => {
  try {
    // Step 1: Find tourists whose birthday is today
    const today = new Date();
    console.log("Today's Date:", today);

    const touristsWithBirthday = await Tourist.find({
      $expr: {
        $and: [
          { $eq: [{ $dayOfMonth: "$date_of_birth" }, today.getDate()] },
          { $eq: [{ $month: "$date_of_birth" }, today.getMonth() + 1] },
        ],
      },
    });

    // Step 2: Loop through tourists and create promo codes
    const createdPromoCodes = [];
    let alreadyHasPromoCode;
    for (const tourist of touristsWithBirthday) {
      const promoCode = new PromoCode({
        code: `BDAY-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        discount: 20, // Example discount
        expiryDate: new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          today.getDate()
        ), // 1 month validity
        touristId: tourist._id, // Link to the tourist
      });

      await promoCode.save();
      createdPromoCodes.push(promoCode);

      // Step 3: Send the promo code via email
      await sendPromoCodeEmail(
        tourist.email,
        promoCode.code,
        promoCode.discount
      );
    }

    res.status(200).json({
      message: "Birthday promo codes sent successfully.",
      promoCodes: createdPromoCodes,
    });
  } catch (error) {
    console.error("Error sending birthday promo codes:", error);
    res.status(500).json({
      message: "Failed to send birthday promo codes.",
      error: error.message || "Unknown error occurred",
    });
  }
};

// Helper Function: Send Email with Promo Code
const sendPromoCodeEmail = async (email, promoCode, discount) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASS, // Replace with your email password or app-specific password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Happy Birthday! Here's Your Promo Code 🎉",
      text: `Happy Birthday! As a special gift, here's a promo code just for you: ${promoCode}. Enjoy a ${discount}% discount on anything on our website!`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Promo code email sent to ${email}`);
  } catch (error) {
    console.error("Error sending promo code email:", error);
  }
};

// Fetch all promo codes for a specific tourist
exports.getPromoCodesForTourist = async (req, res) => {
  try {
    const { touristId } = req.params;

    // Find active promo codes linked to the tourist
    const promoCodes = await PromoCode.find({
      touristId,
      expiryDate: { $gte: new Date() }, // Check promo code is not expired
      isActive: true,
    });

    if (!promoCodes.length) {
      return res.status(200).json({ message: "No active promo codes found." });
    }

    res.status(200).json({ promoCodes });
  } catch (error) {
    console.error("Error fetching promo codes for tourist:", error);
    res.status(500).json({ message: "Failed to fetch promo codes.", error });
  }
};
const checkIfTouristHasPromoCode = async (touristId) => {
  const promoCode = await PromoCode.findOne({ touristId });
  if (promoCode) {
    return true;
  } else {
    return false;
  }
};
