const mongoose = require("mongoose");

const HistoricalPlaceSchema = new mongoose.Schema(
  {
    governorUsername: {
      type: String,
    },
    governorId: {
      //lsa mhtag governor schema
      type: mongoose.Schema.Types.ObjectId,
      ref: "Governor",
    },
    name: { type: String, default: "placeholder" }, //should be unique
    description: { type: String, default: "placeholder" },
    location: { type: String, default: "placeholder" },
    historicalSignificance: { type: String, default: "very important" }, // Information on the history of the place
    // established: { type: Date }, // Date when the historical site was established
    entryFeeForeign: { type: Number, default: 250 },
    entryFeeNative: { type: Number, default: 200 },
    entryFeeStudent: { type: Number, default: 150 },
    openingHours: { type: String, default: "placeholder" }, // E.g., "9:00 AM - 6:00 PM"
    // accessibilityFeatures: { type: [String] }, // E.g., "Wheelchair access"
    // notableEvents: [{ type: String }], // Key historical events tied to the place
    // website: { type: String, default: "website" }, // Website or additional information link
    pictures: [{ type: String }],
    category: {
      type: String, // Type of the historical place (e.g., Museum, Monument, etc.)
      // enum: ["Museum", "Monument", "Religious Site", "Palace", "Castle"],
      default: "Museum",
    },
    // tag: {
    //   type: {
    //     type: String, // Type of the historical place (e.g., Museum, Monument, etc.)
    //     enum: ["Museum", "Monument", "Religious Site", "Palace", "Castle"],
    //     default: "placeholder",
    //   },
    //   historicalPeriod: {
    //     type: String,
    //     default: "placeholder", // Historical period (e.g., Ancient, Medieval, etc.)
    //   },
    // },
    tags: {
      type: [String],
    },
    type: {
      type: String, // Type of the historical place (e.g., Museum, Monument, etc.)
      // enum: ["Museum", "Monument", "Religious Site", "Palace", "Castle"],
      default: "Museum",
    },
  },
  { collection: "historical_places", timestamps: true }
);

const HistoricalPlaceModel = mongoose.model(
  "HistoricalPlace",
  HistoricalPlaceSchema
);
module.exports = HistoricalPlaceModel;
