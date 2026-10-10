const mongoose = require('mongoose');

// Define the Seller schema
const SellerRegSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    password: {
        type: String,
        required: true
    }
}, { collection: 'sellers' }); // Name of the collection in MongoDB

// Create and export the Seller model
const SellerRegModel = mongoose.model("sellers", SellerRegSchema);
module.exports = SellerRegModel;
