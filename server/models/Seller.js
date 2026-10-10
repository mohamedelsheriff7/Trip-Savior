const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "placeholder",
  },
  description: {
    type: String,
    default: "placeholder",
  },
  documents: {
    idSellerProof: { type: String, required: true }, // Path or URL to ID proof
    taxationRegisteryCard: { type: String, required: true }, // Path or URL to certificates
  },
  status: { type: String, default: "Pending" },
  revenue: { type: Number, default: 0 },
  notifications: [{ message: String }],
  termsAndConditions: { type: Boolean, default: false },
});

const SellerModel = mongoose.model("Seller", SellerSchema);
module.exports = SellerModel;
