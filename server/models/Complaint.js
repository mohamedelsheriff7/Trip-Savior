const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComplaintSchema = new Schema({
  TouristID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tourist",
    },
    TouristUsername: {
      type: String,
      
    },
  Title: {
    type: String 
  },
  Body: {
    type: String 
  },
  Date: {
    type: Date 
  },
  Status: {
    type: String,
    default: "Pending"
  },
  Reply: {
    type: String, // Stores the reply to the complaint
    default: ""
  },
}, { timestamps: true });

const Complaint = mongoose.model('Complaint', ComplaintSchema);
module.exports = Complaint;