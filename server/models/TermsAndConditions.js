const mongoose = require("mongoose");

const TermsAndConditionsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Each username should have only one entry
  },
  role: {
    type: String,
    required: true,
  },
  accepted: {
    type: Boolean,
    default: false,
  },
  acceptanceDate: {
    type: Date,
    default: null, // Set when the terms are accepted
  },
});

const TermsAndConditions = mongoose.model(
  "TermsAndConditions",
  TermsAndConditionsSchema
);

module.exports = TermsAndConditions;
