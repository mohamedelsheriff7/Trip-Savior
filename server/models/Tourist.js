const mongoose = require("mongoose");

// Helper function to calculate age based on date of birth
const calculateAge = (dob) => {
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const TouristSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    work_status: {
      type: String,
      required: true,
    },

    wallet: {
      type: Number,
      default: 0,
    },
    level: {
      // Tourist level for loyalty program
      type: Number,
      required: true,
      default: 1, // Default to level 1
    },
    loyaltyPoints: {
      // To store accumulated loyalty points
      type: Number,
      default: 0,
    },
    ratedProducts: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        rating: { type: Number },
      },
    ],

    purchasedItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 }, // Track quantity of each purchased item
      },
    ],

    preferences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Preference" }],

    attendedActivities: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
    ],
    bookedItineraries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Itinerary", // Reference to the Itinerary model
      },
    ],
    bookedActivities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity", // Reference to the Activity model
      },
    ],

    notifications: [
      {
        message: String,
        eventType: String, // "Activity" or "Itinerary"
        eventId: mongoose.Schema.Types.ObjectId,
        read: { type: Boolean, default: false },
      },
    ],

    touristprefrences: [{ type: String }] ,
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 }, // Track quantity of each cart item
      },
    ],

    bookedHotels: [
      {
        totalPrice: Number,
        currency: String,
        hotelName: String,
        location: String,
        checkInDate: String,
        checkOutDate: String,
        bookingId: String,
      },
    ],
    bookedFlights: [
      {
        totalPrice: Number,
        currency: String,
        origin: String,
        destination: String,
        departureDate: String,
        returnDate: String,
        bookingId: String,
      },
    ],
    bookedTransportations: [
      {
        name: String,
        city: String,
        price: Number,
        bookingId: String,
      },
    ],
    orders: [
      {
        order: [
          {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, default: 1 },
          },
        ],
        totalPrice: { type: Number },
        date: { type: String },
        ETA: { type: String },
        status: { type: String },
        address: { type: String },
      },
    ],

    deliveryAddresses: [{ type: String }],
  },
  
  { collection: "Tourists" }
);

// Virtual field to check if today is the tourist's birthday
TouristSchema.virtual("isBirthday").get(function () {
  const today = new Date();
  return (
    this.date_of_birth &&
    today.getDate() === this.date_of_birth.getDate() &&
    today.getMonth() === this.date_of_birth.getMonth()
  );
});

// Method to check if the tourist is eligible to book (age 18 or older)
TouristSchema.methods.canBook = function () {
  const age = calculateAge(this.date_of_birth);
  return age >= 18;
};

const TouristModel = mongoose.model("Tourists", TouristSchema);
module.exports = TouristModel;
