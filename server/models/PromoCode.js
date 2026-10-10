const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  usageLimit: {
    type: Number,
    default: 1,
  },
  timesUsed: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  touristId: { // Link promo code to a specific tourist
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourists",
    required: false // Only required for tourist-specific promo codes
  }
  
}, { timestamps: true });

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

module.exports = PromoCode;
