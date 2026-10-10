const mongoose = require("mongoose");

const ItinerarySchema = new mongoose.Schema(
  {
    Itinerary_Name: {
      type: String,
      required: true,
    },
    tourGuideName: {
      type: String,
      required: true,
    },
    activity: [
      {
        time: { type: String}, // First attribute of the object 
        name: { type: String}, // Second attribute of the object
      },
    ],
    preferences: {
      type: [String], // Array of strings for preferences
      default: [], // Initialize with an empty array by default
    },
    locationToBeVisited: {
      type: [String], // Change to an array of strings for multiple locations
      default: [], // Initialize with an empty array by default
    },
    languageOfTour: {
      type: String,
      default: "placeholder",
    },
    price: {
      type: Number,
      default: 1,
    },
    date_time: {
      type: Date,
      default: Date.now, // Use Date type for better handling of date and time
    },
    accessibility: {
      type: [String],
      default: []
    },
    pickupLocation: {
      type: String,
      default: "placeholder",
    },
    dropoffLocation: {
      type: String,
      default: "placeholder",
    },
    booked: {
      type: Boolean,
      default: false,
    },
    totalRating: {type:[Number], default:[]},
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0, // Field for rating (0 to 5)
    },
    active: {
      type: Boolean,
      default: false,
    },
    bookedBy: {type:[String], default:[]} ,
    comments: {type:[String], default:[]},
    isFlagged: 
    { type: Boolean, 
      default: false 
    },

    interestedUsers: { type: [String], default: [] },
    pictures: [{ type: String }],  
 // Array of usernames

  },
  { collection: "itinerary", timestamps: true } // Automatically add createdAt and updatedAt fields
  
);

// Create the Itinerary model
const ItineraryModel = mongoose.model("Itinerary", ItinerarySchema);
module.exports = ItineraryModel;
