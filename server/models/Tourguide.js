const mongoose = require("mongoose");
const TourGuideSchema = new mongoose.Schema(
  {
    username: { type: String, default: "placeholder" },
    email: { type: String, default: "placeholder" },
    password: { type: String, default: "placeholder" },
    age: { type: Number, default: 1 },
    mobileNumber: { type: Number, default: 1 },
    years_of_experience: { type: Number, default: 1 },
    previous_work: { type: String, default: "placeholder" },
    work_status: { type: String, default: "Rejected" },
    documents: {
      idProof: { type: String, required: true }, // Path or URL to ID proof
      certificates: { type: String, required: true }, // Path or URL to certificates
    },
    status: { type: String, default: "Pending" },
    totalRating: { type: [Number], default: [] },
    rating: { type: Number, min: 0, max: 5, default: 1 },
    comments: { type: [String], default: [] },
    termsAndConditions: { type: Boolean, default: false },
  },
  { collection: "tour_guide" }
);

const TourGuideModel = mongoose.model("Tourguide", TourGuideSchema);
module.exports = TourGuideModel;
