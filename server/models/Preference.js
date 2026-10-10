const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferenceSchema = new Schema({
  Name: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const Preference = mongoose.model('Preference', preferenceSchema);
module.exports = Preference;