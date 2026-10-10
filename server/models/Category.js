const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
 
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;