const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
    },
    sellerUsername: {
      //lsa mhtag seller schema
      type: String,
    },
    sellerId: {
      //lsa mhtag advertiser schema
      type: mongoose.Schema.Types.ObjectId,
      ref: "seller",
    },
    Ratings: {
      type: Number,
    },
    AllRatings: {
      type: [Number], // Array of numbers for ratings
      default: [], // Default to an empty array
    },
    Reviews: {
      type: [String],
      default:[] ,
    },
    Price: {
      type: Number,
    },
    Quantity: {
      type: Number,
      required: true,
    },
    Picture: {
      type: String, // URL or path to the image
      // Make it required if you want all products to have an image
    },
    Sold: {
      type: Number, default: 0
    },
    isArchived: {
      type: Boolean,
      default: false,
  },
  date: { type: Date, required: true },

  },
  { timestamps: true }
);



const productModel = mongoose.model("Product", productSchema);
module.exports = { productModel };
