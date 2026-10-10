// models/Bookmark.js
const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourists", // Replace with your actual user model name
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "type", // Dynamically reference either the Itinerary or Activity model
    required: true,
  },
  type: {
    type: String,
    enum: ["itinerary", "activities"], // Specify the allowed types
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

module.exports = Bookmark;


