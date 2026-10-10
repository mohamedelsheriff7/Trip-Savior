const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  advertiserUsername: { type: String }, //mhtagha
  name: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  specialDiscounts: { type: String, required: false },
  bookingOpen: { type: Boolean, default: true },
  isFlagged: { type: Boolean, default: false },
  rating: { type: Number, min: 0, max: 5, default: 1 },
  bookedBy: {type:[String], default:[]},
  AllRatings: {
    type: [Number], // Array of numbers for ratings
    default: [], // Default to an empty array
  },
  comments : {type : [String] , default : [] }, 
  interestedUsers: { type: [String], default: [] }, // Array of usernames

  
  pictures: [{ type: String }],
});

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;

//activitySchema hhhhhh  sss
