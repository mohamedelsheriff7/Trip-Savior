const mongoose = require("mongoose");

const AdvertiserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    password: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      default: "placeholder",
    },
    website: {
      type: String,
      default: "placeholder",
    },

    hotline: {
      type: String,
      default: "placeholder",
    },
    companyProfile: {
      type: String,
      default: "placeholder",
    },
    documents: {
      idAdvertiserProof: { type: String, required: true }, // Path or URL to ID proof
      taxationRegisteryCardAdvertiser: { type: String, required: true }, // Path or URL to certificates
    },
    status: { type: String, default: "Pending" },
    termsAndConditions: { type: Boolean, default: false },
  },
  { collection: "advertisers" }
);

const AdvertiserModel = mongoose.model("advertisers", AdvertiserSchema);

module.exports = AdvertiserModel;
