// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const multer = require("multer");
const formidable = require("formidable");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const otpRoutes = require("./routes/otpRoutes");
const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY
);
const promoCodeController = require("./controllers/promoCodeController");

require("dotenv").config();
const fs = require("fs");

///////////////////////////////////////////////////////////////////////////////////////
const tourGuideRoutes = require("./routes/tourGuideRoutes"); //Ahmed
const TermsAndConditions = require("./models/TermsAndConditions");

const tourismGovernorRoutes = require("./routes/tourismGovernorRoutes"); //Ahmed
const advertiserRoutes = require("./routes/advertiserRoutes"); //Ahmed
const sendEmail = require("./utils/emailService"); // mailer
// Your Itinerary model
////////////////////////////////////////////////////////////////////////////////////////
// Initialize Express app
// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the upload folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});

const upload = multer({ storage });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    res.status(200).json({
      message: "File uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    res.status(500).json({ error: "File upload failed" });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
////products
const productsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "products/";
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, dir);
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadProductImage = multer({ storage: productsStorage });

// Route to upload an image for a specific product
app.put(
  "/uploadProductImage/:id",
  uploadProductImage.single("image"),
  async (req, res) => {
    try {
      const productId = req.params.id;
      const imagePath = req.file ? req.file.path : null;

      if (imagePath) {
        await productModel.findByIdAndUpdate(productId, { Picture: imagePath });
        res.json({ message: "Image uploaded successfully", imagePath });
      } else {
        res.status(400).json({ message: "Image upload failed" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error uploading image", error });
    }
  }
);
app.use("/products", express.static(path.join(__dirname, "products")));

const HistStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "historicalPlaces/";
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, dir);
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadHistImage = multer({ storage: HistStorage });

// Route to upload an image for a specific product
app.put(
  "/uploadHistImage/:id",
  uploadHistImage.single("image"),
  async (req, res) => {
    try {
      const HistId = req.params.id;
      const imagePath = req.file ? req.file.path : null;

      if (imagePath) {
        await HistoricalPlaceModel.findByIdAndUpdate(HistId, {
          pictures: imagePath,
        });
        res.json({ message: "Image uploaded successfully", imagePath });
      } else {
        res.status(400).json({ message: "Image upload failed" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error uploading image", error });
    }
  }
);

app.post(
  "/createHistoricalPlaces",
  uploadHistImage.single("image"), // Handle image upload
  async (req, res) => {
    try {
      const imagePath = req.file ? req.file.path : null;

      if (!imagePath) {
        return res.status(400).json({ message: "Image upload failed" });
      }

      // Create a new historical place using the request body and add the image path
      const newHistoricalPlace = new HistoricalPlaceModel({
        ...req.body, // Spread the other fields from the request body (e.g., name, description, etc.)
        pictures: imagePath, // Add the image path to the pictures field
      });

      // Save the new historical place
      const savedPlace = await newHistoricalPlace.save();

      // Respond with the saved historical place
      res.status(200).json({
        message: "New historical place created with image",
        savedPlace,
      });
    } catch (error) {
      console.error("Error creating historical place:", error);
      res
        .status(500)
        .json({ message: "Error creating historical place", error });
    }
  }
);

app.use(
  "/historicalPlaces",
  express.static(path.join(__dirname, "historicalPlaces"))
);

const ActStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "activities/";
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, dir);
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadActImage = multer({ storage: ActStorage });

// Route to upload an image for a specific product
app.put(
  "/wael/activities/:name",
  uploadHistImage.single("image"),
  async (req, res) => {
    try {
      // Prepare update object
      const updateData = { ...req.body };

      // Handle image upload if a file is present
      if (req.file) {
        updateData.pictures = req.file.path;
      }

      // Find and update the activity
      const updatedActivity = await ActivityModel.findOneAndUpdate(
        { name: req.params.name },
        updateData,
        { new: true }
      );

      // Check if activity was found and updated
      if (!updatedActivity) {
        return res.status(404).json({ message: "Activity not found" });
      }

      // Respond with success message and updated activity
      res.json({
        message: "Activity updated successfully",
        activity: updatedActivity,
        ...(req.file && { imagePath: req.file.path }),
      });
    } catch (error) {
      console.error("Error updating activity:", error);
      res.status(500).json({
        message: "Error updating activity",
        error: error.message,
      });
    }
  }
);

app.post(
  "/wael/activities",
  uploadActImage.single("image"),
  async (req, res) => {
    try {
      // Check if image upload is required and handled
      const imagePath = req.file ? req.file.path : null;

      // If image is required but not uploaded, return an error
      if (!imagePath) {
        return res.status(400).json({ message: "Image upload failed" });
      }

      // Create a new activity with all body fields and the image path
      const newActivity = new ActivityModel({
        ...req.body,
        pictures: imagePath,
      });

      // Save the new activity
      const savedActivity = await newActivity.save();

      // Respond with success message and saved activity
      res.status(201).json({
        message: "Activity created successfully",
        activity: savedActivity,
      });
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(500).json({
        message: "Error creating activity",
        error: error.message,
      });
    }
  }
);

app.use("/activities", express.static(path.join(__dirname, "activities")));

const ItStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "itenraries/";
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, dir);
    });
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadItImage = multer({ storage: ItStorage });

// Route to upload an image for a specific product
app.put("/itenraries", uploadItImage.single("image"), async (req, res) => {
  try {
    // Prepare update object
    const updateData = { ...req.body };

    // Handle image upload if a file is present
    if (req.file) {
      updateData.pictures = req.file.path;
    }

    // Find and update the activity
    const updatedItinerary = await ItineraryModel.findOneAndUpdate(
      { name: req.params.name },
      updateData,
      { new: true }
    );

    // Check if activity was found and updated
    if (!updatedItinerary) {
      return res.status(404).json({ message: "Itenrary not found" });
    }

    // Respond with success message and updated activity
    res.json({
      message: "It updated successfully",
      activity: updatedItinerary,
      ...(req.file && { imagePath: req.file.path }),
    });
  } catch (error) {
    console.error("Error updating activity:", error);
    res.status(500).json({
      message: "Error updating activity",
      error: error.message,
    });
  }
});

app.post("/itinerary", uploadActImage.single("image"), async (req, res) => {
  try {
    // Destructure required fields from request body
    const {
      Itinerary_Name,
      tourGuideName,
      activities,
      preferences,
      locationToBeVisited,
      timeline,
      durationOfActivity,
      languageOfTour,
      price,
      date_time,
      accessibility,
      pickupLocation,
      dropoffLocation,
      booked,
      rating,
      isFlagged,
    } = req.body;

    // Handle image upload
    const imagePath = req.file ? req.file.path : null;

    // Optional: Validate image upload if required
    // if (!imagePath) {
    //   return res.status(400).json({ message: "Image upload failed" });
    // }

    // Create a new itinerary with all body fields and optional image
    const createdItinerary = new ItineraryModel({
      Itinerary_Name,
      tourGuideName,
      activities,
      preferences,
      locationToBeVisited,
      timeline,
      durationOfActivity,
      languageOfTour,
      price,
      date_time,
      accessibility,
      pickupLocation,
      dropoffLocation,
      booked,
      rating,
      isFlagged,
      // Add pictures only if an image was uploaded
      ...(imagePath && { pictures: imagePath }),
    });

    // Save the new itinerary
    const savedItinerary = await createdItinerary.save();

    console.log("Itinerary created successfully:", savedItinerary);
    res.status(201).json({
      message: "Itinerary created successfully",
      itinerary: savedItinerary,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      console.error("Validation error:", error.errors);
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    // Handle other errors
    console.error("Error creating itinerary:", error);
    res.status(500).json({
      message: "Server error while creating itinerary",
      error: error.message,
    });
  }
});

app.use("/itineraries", express.static(path.join(__dirname, "itineraries")));

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://nourhanmorad8:rz8REez3PEX4u5KD@cluster0.q2q36.mongodb.net/Trip_Saviour?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error: ", err));

// Import Models
const TourGuideModel = require("./models/Tourguide");
const ActivityModel = require("./models/Activity");
const ItineraryModel = require("./models/Itinerary");
const PreferenceModel = require("./models/Preference"); // Ensure you have this model

const TouristModel = require("./models/Tourist.js");
const HistoricalPlaceModel = require("./models/HistoricalPlace"); //ahmed
const AdvertiserModel = require("./models/Advertiser.js");
const { productModel } = require("./models/product");
const TagsModel = require("./models/Preference"); //ahmed
const placeModel = require("./models/HistoricalPlace"); // Correct path
const categoryModel = require("./models/Category");
const CategoryModel = require("./models/Category");
const ComplaintModel = require("./models/Complaint.js");
const adminModel = require("./models/Admin");
const tourismGovernerModel = require("./models/TourismGoverner");
const SellerModel = require("./models/Seller.js");
const Activity = require("./models/Activity.js");
const AccountDeletionRequest = require("./models/RequestDelete.js");
const Tourist = require("./models/Tourist.js");
//const Bookmark = require('./models/Bookmark.js');

/////MAYA's///////////

const currencyController = require("./controllers/currencyController");
app.get("/api/convert-currency", currencyController.convertCurrency);

const complaintController = require("./controllers/complaintController");
app.post("/api/file-complaint", complaintController.fileComplaint);

const shareController = require("./controllers/shareController");
app.get("/api/share/:type/:id", shareController.generateShareLink);
app.post("/api/share/email", shareController.sendShareEmail);

const Itinerary = require("./models/Itinerary");
// In your backend routes file (e.g., `itineraries.js` or `app.js`)
app.get("/itineraries/:id", async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve itinerary" });
  }
});

const HistoricalPlace = require("./models/HistoricalPlace");
// In your backend routes file (e.g., `historicalPlaces.js` or `app.js`)
app.get("/historical-places/:id", async (req, res) => {
  try {
    const historicalPlace = await HistoricalPlace.findById(req.params.id);
    if (!historicalPlace) {
      return res.status(404).json({ message: "Historical place not found" });
    }
    res.json(historicalPlace);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve historical place" });
  }
});

//const Activity = require('./models/Activity'); // Adjust this path as needed
// Get an activity by ID
app.get("/activities/:id", async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve activity" });
  }
});

const Bookmark = require("./models/Bookmark"); // Import your Bookmark model

const BookmarkController = require("./controllers/BookmarkController"); // Adjust the path based on your structure

// Route to add a bookmark
app.post("/api/bookmark/add", BookmarkController.addBookmark);

// Route to get all bookmarks for a specific tourist
app.get("/api/bookmark/tourist/:touristId", BookmarkController.getBookmarks);

// Route to remove a bookmark
app.delete("/api/bookmark/remove", BookmarkController.removeBookmark);

const PromoCodeController = require("./controllers/promoCodeController");

// Route to create a promo code
app.post("/api/promo-code", PromoCodeController.createPromoCode);
app.post(
  "/api/send-birthday-promo",
  PromoCodeController.sendBirthdayPromoCodes
);
app.get(
  "/api/promo-codes/:touristId",
  PromoCodeController.getPromoCodesForTourist
);

const { sendBirthdayPromoCodes } = require("./controllers/promoCodeController");

cron.schedule("* * * * *", async () => {
  console.log("Running daily task to send birthday promo codes...");
  try {
    // Call the function directly
    await sendBirthdayPromoCodes();
  } catch (error) {
    console.error("Error in scheduled task:", error);
  }
});
// ================== Ahmed Routes =========================//
const PromoCode = require("./models/PromoCode.js");
app.get("/filterHistoricalPlaces", async (req, res) => {
  //bta3t reem tourist/guest
  const { sortBy, budget, date, language, tags } = req.query;

  let filter = {};

  if (tags) {
    const tagList = tags.split(","); // Split by commas if multiple tags are provided
    filter.tags = {
      $regex: tagList.join("|"), // Create a regex with OR conditions for multiple tags
      $options: "i", // Make the search case-insensitive
    };
  }

  try {
    const historicalPlaces = await HistoricalPlaceModel.find(filter);
    res.json(historicalPlaces);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching historical places",
      error: error.message,
    });
  }
});
app.get("/itinerary", async (req, res) => {
  try {
    const itineraries = await ItineraryModel.find();
    res.json(itineraries);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Server error while fetching itineraries" });
  }
});
app.post("/tourism-governor/login", async (req, res) => {
  const { username, Password } = req.body; // Removed email from the body

  try {
    // Find the tourist by Username only
    const tourismGovernor = await tourismGovernerModel.findOne({
      username,
    });

    if (!tourismGovernor) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Validate the Password directly (no hashing)
    if (tourismGovernor.Password !== Password) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Login success
    res.status(200).json({ message: "Login successful", tourismGovernor });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
app.use("/tourGuide", tourGuideRoutes);
app.use("/tourismGovernor", tourismGovernorRoutes);
app.use("/advertiser", advertiserRoutes);
// ================== Wael Routes =========================//
// POST route to create a new activity
app.post("/wael/activities", async (req, res) => {
  try {
    const newActivity = new ActivityModel({ ...req.body });
    const savedActivity = await newActivity.save();
    res.status(201).json({
      message: "Activity created successfully",
      activity: savedActivity,
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating activity" });
  }
});

// GET route to fetch all activities
app.get("/wael/activities", async (req, res) => {
  try {
    const activities = await ActivityModel.find();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: "Error fetching activities" });
  }
});

// GET route to fetch activity by name
app.get("/wael/activities/:name", async (req, res) => {
  try {
    const activity = await ActivityModel.findOne({ name: req.params.name });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: "Error fetching activity" });
  }
});

// PUT route to update an activity by name
app.put("/wael/activitiess/:name", async (req, res) => {
  try {
    const updatedActivity = await ActivityModel.findOneAndUpdate(
      { name: req.params.name },
      { ...req.body },
      { new: true }
    );
    if (!updatedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json({
      message: "Activity updated successfully",
      activity: updatedActivity,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating activity" });
  }
});

// DELETE route to delete an activity by name
app.delete("/wael/activities/:name", async (req, res) => {
  try {
    const deletedActivity = await ActivityModel.findOneAndDelete({
      name: req.params.name,
    });
    if (!deletedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting activity" });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const categories = await CategoryModel.find(); // Assuming categories are stored as strings (e.g., "Category1,Category2,Category3")

    // Map through categories and transform into an array of lowercase trimmed strings
    const processedCategories = categories.map((category) => {
      return category.Name.split(",") // Split string by commas
        .map((cat) => cat.trim().toLowerCase()) // Trim spaces and convert to lowercase
        .filter(Boolean); // Remove any empty strings
    });

    res.json(processedCategories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories" });
  }
});

// Tags Route
app.get("/preferences", async (req, res) => {
  try {
    const tags = await TagsModel.find(); // Fetch all preference entries

    // Check if tags have been fetched correctly
    if (!tags || tags.length === 0) {
      return res.status(404).json({ message: "No tags found" });
    }

    // Process tags: each entry has a Name field which may or may not contain commas
    const processedTags = tags.flatMap((tag) => {
      const tagNames = tag.Name.split(",") // Split by commas
        .map((t) => t.trim().toLowerCase()) // Trim spaces and convert to lowercase
        .filter(Boolean); // Remove any empty strings
      return tagNames; // Return the processed tag names
    });

    res.json(processedTags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Error fetching tags" });
  }
});
// ================== Tour Guide Routes ================== //

const bcrypt = require("bcrypt"); // Make sure to install bcrypt
// Create or Update Profile
app.post("/tour_guide", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      age,
      mobileNumber,
      years_of_experience,
      previous_work,
      work_status,
    } = req.body;

    const existingTourGuide = await TourGuideModel.findOne({
      username,
      email,
      password,
    });

    if (existingTourGuide) {
      existingTourGuide.age = age;
      existingTourGuide.mobileNumber = mobileNumber;
      existingTourGuide.years_of_experience = years_of_experience;
      existingTourGuide.previous_work = previous_work;
      existingTourGuide.work_status = work_status;

      await existingTourGuide.save();
      console.log("Profile updated:", existingTourGuide);
      return res.status(200).json(existingTourGuide);
    }

    return res
      .status(404)
      .json({ message: "User does not exist. Please check your credentials." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server is not working" });
  }
});

// Fetch Tour Guide Profile
app.get("/tour_guide", async (req, res) => {
  try {
    const { username, email, password } = req.query; // Get all three parameters

    // If username, email, and password are provided, filter by them
    const filter = {};
    if (username) filter.username = username;
    if (email) filter.email = email;
    if (password) filter.password = password;

    const tourguides = await TourGuideModel.find(filter); // Apply the filter

    // Check if there are any tour guides found
    if (tourguides.length === 0) {
      console.log("No tour guides found."); // Log this for debugging
      return res.status(404).json({ message: "No tour guides found." });
    }

    res.json(tourguides); // Send the tour guide details
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server is not working" });
  }
});

// Update Profile
app.put("/tour_guide", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      age,
      mobileNumber,
      years_of_experience,
      previous_work,
      work_status,
    } = req.body;

    // Find the existing tour guide based on username or email
    const existingTourGuide = await TourGuideModel.findOne({ username });

    if (existingTourGuide) {
      // Verify the password
      if (existingTourGuide.password !== password) {
        return res.status(401).json({ message: "Incorrect password." });
      }

      // Update fields
      if (email !== undefined) existingTourGuide.email = email;
      if (age !== undefined) existingTourGuide.age = age;
      if (mobileNumber !== undefined)
        existingTourGuide.mobileNumber = mobileNumber;
      if (years_of_experience !== undefined)
        existingTourGuide.years_of_experience = years_of_experience;
      if (previous_work !== undefined)
        existingTourGuide.previous_work = previous_work;
      if (work_status !== undefined)
        existingTourGuide.work_status = work_status;

      await existingTourGuide.save();
      console.log("Profile updated:", existingTourGuide);
      return res.status(200).json(existingTourGuide);
    }

    return res
      .status(404)
      .json({ message: "User does not exist. Please check your credentials." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server is not working" });
  }
});

// ================== Activity Routes ================== //

// POST route to create a new activity
app.post("/activities", async (req, res) => {
  const {
    date,
    time,
    location,
    price,
    category,
    tags,
    specialDiscounts,
    bookingOpen,
  } = req.body;
  try {
    const newActivity = new ActivityModel({
      date,
      time,
      location,
      price,
      category,
      tags,
      specialDiscounts,
      bookingOpen,
      isFlagged,
    });
    await newActivity.save();
    res.status(201).json({
      message: "Activity created successfully",
      activity: newActivity,
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating activity" });
  }
});

// GET route to fetch all activities
app.get("/activities", async (req, res) => {
  try {
    const activities = await ActivityModel.find();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: "Error fetching activities" });
  }
});

// GET route to fetch activity by ID
app.get("/activities/:id", async (req, res) => {
  try {
    const activity = await ActivityModel.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: "Error fetching activity" });
  }
});

// PUT route to update an activity by ID
app.put("/activities/:id", async (req, res) => {
  const { id } = req.params;
  const {
    date,
    time,
    location,
    price,
    category,
    tags,
    specialDiscounts,
    bookingOpen,
    isFlagged,
    bookedBy,
  } = req.body;
  try {
    const updatedActivity = await ActivityModel.findByIdAndUpdate(
      id,
      {
        date,
        time,
        location,
        price,
        category,
        tags,
        specialDiscounts,
        bookingOpen,
        isFlagged,
        bookedBy,
      },
      { new: true }
    );
    if (!updatedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    if (isFlagged) {
      try {
        const advertiser = await AdvertiserModel.findOne({
          username: updatedActivity.advertiserUsername,
        });

        if (advertiser && advertiser.email) {
          // Use separate function for activity notifications
          await sendFlagNotificationEmailActivity(
            advertiser.email,
            updatedActivity.name
          );
          console.log("Flag notification sent successfully");
        }
      } catch (emailError) {
        console.error("Error sending notification:", emailError);
      }
    }

    res.json(updatedActivity);
  } catch (err) {
    console.error("Error updating activity:", err);
    res.status(500).json({ message: "Server error while updating activity" });
  }
});

// DELETE route to delete an activity by ID
app.delete("/activities/:id", async (req, res) => {
  try {
    const deletedActivity = await ActivityModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedActivity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting activity" });
  }
});

// ================== Itinerary Routes ================== //

// Create Itinerary Route
app.post("/itineraryy", async (req, res) => {
  try {
    const {
      Itinerary_Name,
      tourGuideName,
      activities,
      preferences,
      locationToBeVisited,
      timeline,
      durationOfActivity,
      languageOfTour,
      price,
      date_time,
      accessibility,
      pickupLocation,
      dropoffLocation,
      booked,
      rating,
      isFlagged,
    } = req.body;

    // Create a new itinerary
    const createdItinerary = new ItineraryModel({
      Itinerary_Name,
      tourGuideName,
      activities,
      preferences,
      locationToBeVisited,
      timeline,
      durationOfActivity,
      languageOfTour,
      price,
      date_time,
      accessibility,
      pickupLocation,
      dropoffLocation,
      booked,
      rating,
      isFlagged,
    });

    // Add itinerary to the database
    const addItinerary = await createdItinerary.save();
    console.log("Itinerary created successfully:", addItinerary);
    res.status(201).json(addItinerary);
  } catch (err) {
    if (err.name === "ValidationError") {
      console.error("Validation error:", err.errors);
      return res
        .status(400)
        .json({ message: "Validation error", errors: err.errors });
    }
    console.error(err);
    res.status(500).json({ message: "Server error while creating itinerary" });
  }
});

// Read All Itineraries Route
// Read All Itineraries Route
app.get("/itinerary", async (req, res) => {
  try {
    // Fetch all itineraries from the database
    const itineraries = await ItineraryModel.find(); // Fetch all itineraries
    console.log("All Itineraries:", itineraries); // Debugging log

    // If no itineraries are found, return an empty array
    if (!itineraries) {
      return res.status(404).json({ message: "No itineraries found." });
    }

    res.json(itineraries); // Return all itineraries
  } catch (err) {
    console.error("Error fetching itineraries:", err); // More specific error logging
    res
      .status(500)
      .json({ message: "Server error while fetching itineraries." });
  }
});

//get all unique preferences from itinerary model
app.get("/itinerary-preferences", async (req, res) => {
  try {
    const preferences = await ItineraryModel.aggregate([
      { $unwind: "$preferences" }, // Unwind the array
      { $group: { _id: "$preferences" } }, // Group by individual preference
      { $sort: { _id: 1 } }, // (Optional) Sort the preferences alphabetically
      { $project: { _id: 0, preference: "$_id" } }, // Format the result
    ]);

    res.json(preferences.map((pref) => pref.preference)); // Map to an array of values
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Server error while fetching preferences" });
  }
});

app.post("/tourist/preferences", async (req, res) => {
  const { username, preference, action } = req.body;

  try {
    const tourist = await TouristModel.findOne({ username });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    if (action === "add") {
      // Add preference if it doesn't already exist
      if (!tourist.preferences.includes(preference)) {
        tourist.preferences.push(preference);
        await tourist.save();
      }
    } else if (action === "remove") {
      // Remove preference if it exists
      tourist.preferences = tourist.preferences.filter(
        (item) => item !== preference
      );
      await tourist.save();
    }

    res.status(200).json({ message: "Preference updated successfully" });
  } catch (err) {
    console.error("Error updating preferences:", err);
    res
      .status(500)
      .json({ message: "Server error while updating preferences" });
  }
});

// Update Itinerary Route
app.put("/itinerary/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      Itinerary_Name,
      tourGuideName,
      activity,
      active,
      preferences,
      locationToBeVisited,
      languageOfTour,
      price,
      date_time,
      accessibility,
      pickupLocation,
      dropoffLocation,
      booked,
      rating,
      isFlagged,
      bookedBy,
    } = req.body;

    // Find and update the itinerary
    const updatedItinerary = await ItineraryModel.findByIdAndUpdate(
      id,
      {
        Itinerary_Name,
        tourGuideName,
        activity,
        active,
        preferences,
        locationToBeVisited,
        languageOfTour,
        price,
        date_time,
        accessibility,
        pickupLocation,
        dropoffLocation,
        booked,
        rating,
        isFlagged,
        bookedBy,
      },
      { new: true }
    );

    if (!updatedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    if (isFlagged) {
      try {
        const tourGuide = await TourGuideModel.findOne({
          username: tourGuideName,
        });
        if (tourGuide && tourGuide.email) {
          await sendFlagNotificationEmail(tourGuide.email, Itinerary_Name);
          console.log(`Notification email sent to ${tourGuide.email}`);
        }
      } catch (emailError) {
        console.error("Error sending notification:", emailError);
        // Continue with response even if email fails
      }
    }

    res.json(updatedItinerary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating itinerary" });
  }
});

// Delete Itinerary Route
app.delete("/itinerary/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItinerary = await ItineraryModel.findByIdAndDelete(id);
    if (!deletedItinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    res.json({ message: "Itinerary deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while deleting itinerary" });
  }
});

// ================== Preference Routes ================== //

// Create Preference Route
app.post("/preferences", async (req, res) => {
  try {
    const {
      userId,
      language,
      accessibilityNeeds,
      activityType,
      specialRequests,
    } = req.body;

    const newPreference = new PreferenceModel({
      userId,
      language,
      accessibilityNeeds,
      activityType,
      specialRequests,
    });

    await newPreference.save();
    res.status(201).json({
      message: "Preference created successfully",
      preference: newPreference,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while creating preference" });
  }
});

// Get All Preferences Route
app.get("/preferences", async (req, res) => {
  try {
    const preferences = await PreferenceModel.find();
    res.json(preferences);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Server error while fetching preferences" });
  }
});
// =============================== Tourist Registration ===============================

// Function to handle tourist creation
const createTourist = async (req, res) => {
  const {
    email,
    username,
    password,
    mobileNumber,
    nationality,
    date_of_birth,
    work_status,
  } = req.body;
  try {
    const isUnique = await checkUsernameUnique(username);
    if (!isUnique) {
      return res.status(400).json({
        message:
          "Username already exists across stakeholders. Please choose a different one.",
      });
    }
    const existingTourist = await TouristModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingTourist) {
      return res.status(400).json({
        message:
          "Email or Username already in use, please choose a different one.",
      });
    }

    const tourist = await TouristModel.create({
      email,
      username,
      password,
      mobileNumber,
      nationality,
      date_of_birth,
      work_status,
    });
    res.status(200).json(tourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

app.post("/createTourist", createTourist);

// Check if a tourist can book
app.get("/canBook/:id", async (req, res) => {
  try {
    const tourist = await TouristModel.findById(req.params.id);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    if (tourist.age >= 18) {
      return res.status(200).json({ message: "This tourist can book." });
    } else {
      return res
        .status(403)
        .json({ message: "Tourists under 18 cannot book." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Check if a tourist can book
app.get("/canBook/:id", async (req, res) => {
  try {
    const tourist = await TouristModel.findById(req.params.id);
    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    if (tourist.age >= 18) {
      return res.status(200).json({ message: "This tourist can book." });
    } else {
      return res
        .status(403)
        .json({ message: "Tourists under 18 cannot book." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update tourist data except the DOB
const updateTourist = async (req, res) => {
  const { id } = req.params;
  const { email, username, password, mobileNumber, nationality, work_status } =
    req.body;

  try {
    const updatedTourist = await TouristModel.findByIdAndUpdate(
      id,
      { email, username, password, mobileNumber, nationality, work_status },
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedTourist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

app.put("/updateTourist/:id", updateTourist);

// =============================== Tour Guide Registration ===============================
// =============================== Tour Guide Registration ===============================

const checkUsernameUnique = async (username) => {
  const isTourGuide = await TourGuideModel.findOne({ username });
  const isTourist = await TouristModel.findOne({ username });
  const isAdvertiser = await AdvertiserModel.findOne({ username });
  const isSeller = await SellerModel.findOne({ username });
  const isAdmin = await adminModel.findOne({ username: username });
  const isTourismGovernor = await tourismGovernerModel.findOne({
    username: username,
  });
  return !(
    isTourGuide ||
    isTourist ||
    isAdvertiser ||
    isSeller ||
    isAdmin ||
    isTourismGovernor
  );
};

const registerTourGuide = async (req, res) => {
  const { username, email, password } = req.body;
  const { idProof, certificates } = req.files;

  try {
    const isUnique = await checkUsernameUnique(username);
    if (!isUnique) {
      return res.status(400).json({
        message:
          "Username already exists across stakeholders. Please choose a different one.",
      });
    }
    const existingUser = await TourGuideModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already in use." });
    }

    const newTourGuide = await TourGuideModel.create({
      username,
      email,
      password,
      documents: {
        idProof: idProof[0].path, // Store the file path or URL
        certificates: certificates[0].path, // Store the file path or URL
      },
    });
    res.status(201).json({
      message: "Tour guide registered successfully",
      data: newTourGuide,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

app.post(
  "/registerTourGuide",
  upload.fields([{ name: "idProof" }, { name: "certificates" }]),
  registerTourGuide
);

// =============================== Advertiser Registration ===============================

// =============================== Advertiser Registration ===============================

const registerAdvertiser = async (req, res) => {
  const { username, email, password } = req.body;
  const idAdvertiserProof = req.files.idAdvertiserProof[0]?.path; // Access the file path directly
  const taxationRegisteryCardAdvertiser =
    req.files.taxationRegisteryCardAdvertiser[0]?.path;

  try {
    const isUnique = await checkUsernameUnique(username);
    if (!isUnique) {
      return res.status(400).json({
        message:
          "Username already exists across stakeholders. Please choose a different one.",
      });
    }
    const existingAdvertiser = await AdvertiserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingAdvertiser) {
      return res
        .status(400)
        .json({ error: "Username or email already in use" });
    }

    const newAdvertiser = await AdvertiserModel.create({
      username,
      email,
      password,
      documents: {
        idAdvertiserProof,
        taxationRegisteryCardAdvertiser,
      },
    });
    res.status(201).json({
      message: "Advertiser registered successfully",
      data: newAdvertiser,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

app.post(
  "/registerAdvertiser",
  upload.fields([
    { name: "idAdvertiserProof" },
    { name: "taxationRegisteryCardAdvertiser" },
  ]),
  registerAdvertiser
);
// =============================== Seller Registration ===============================

const registerSellerReg = async (req, res) => {
  const { username, email, password } = req.body; // Use req.body for fields from the form
  const idSellerProof = req.files.idSellerProof[0]?.path; // Access the file path directly
  const taxationRegisteryCard = req.files.taxationRegisteryCard[0]?.path; // Access the file path directly

  try {
    // Check for existing seller
    const isUnique = await checkUsernameUnique(username);
    if (!isUnique) {
      return res.status(400).json({
        message:
          "Username already exists across stakeholders. Please choose a different one.",
      });
    }
    const existingSeller = await SellerModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingSeller) {
      return res
        .status(400)
        .json({ error: "Username or email already in use." });
    }

    // Create a new seller
    const newSeller = await SellerModel.create({
      username,
      email,
      password, // Consider hashing the password
      documents: {
        idSellerProof,
        taxationRegisteryCard,
      },
    });
    res
      .status(201)
      .json({ message: "Seller registered successfully", data: newSeller });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Seller registration route
app.post(
  "/registerSellerReg",
  upload.fields([{ name: "idSellerProof" }, { name: "taxationRegisteryCard" }]),
  registerSellerReg
);

// =============================== Seller Management ===============================

// =============================== Seller Management ===============================

// Function to display initial data in the database
async function displayInitialData() {
  try {
    const sellers = await SellerModel.find();
    console.log("Current Sellers in Database:");
    console.log(sellers);
  } catch (err) {
    console.error("Error fetching initial data:", err);
  }
}

// =============================== Create or Update Profile ===============================
app.post("/sellers", async (req, res) => {
  const { username, email, password, name, description } = req.body;

  try {
    // Find seller by username and email first
    const existingSeller = await SellerModel.findOne({ username, email });

    if (existingSeller) {
      // Check if the password matches
      if (existingSeller.password !== password) {
        return res.status(401).json({ message: "Incorrect password." });
      }

      // Update the name and description if they are provided
      if (name) existingSeller.name = name;
      if (description) existingSeller.description = description;
      if (username) existingSeller.username = username;
      if (email) existingSeller.email = email;

      await existingSeller.save(); // Save the updated seller
      console.log("Seller profile updated:", existingSeller);
      return res.status(200).json(existingSeller);
    }

    // If no seller is found with the given username and email, return an error
    return res
      .status(404)
      .json({ message: "User does not exist. Please check your credentials." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server is not working" });
  }
});
// Get all sellers
app.get("/sellers", async (req, res) => {
  try {
    const sellers = await SellerModel.find();
    if (sellers.length === 0) {
      console.log("No sellers found.");
      return res.status(404).json({ message: "No sellers found." });
    }
    console.log("Found sellers:", sellers);
    res.json(sellers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server is not working" });
  }
});

// Get Seller Profile (login)
app.get("/sellers/login", async (req, res) => {
  try {
    const { username, email } = req.query;

    const filter = {};
    if (username) {
      filter.username = username;
    }
    if (email) {
      filter.email = email;
    }

    const seller = await SellerModel.findOne(filter);

    if (!seller) {
      return res.status(404).json({ message: "No seller found." });
    }

    // Optionally, include password verification if needed

    res.json(seller);
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ message: "Server is not working" });
  }
});

app.put("/sellers", async (req, res) => {
  try {
    const { username, email, password, name, description } = req.body;

    // Find the seller by username
    const existingSeller = await SellerModel.findOne({ username });

    if (!existingSeller) {
      return res.status(404).json({
        message: "Seller does not exist. Please check your credentials.",
      });
    }

    // Check password match
    if (existingSeller.password !== password) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    // Check if the new email is already taken
    if (email && email !== existingSeller.email) {
      const emailExists = await SellerModel.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use." });
      }
      existingSeller.email = email; // Update email if unique
    }

    // Check if the new username is already taken
    if (username && username !== existingSeller.username) {
      const usernameExists = await SellerModel.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ message: "Username already in use." });
      }
      existingSeller.username = username; // Update username if unique
    }

    // Update other fields (name, description)
    if (name !== undefined) existingSeller.name = name;
    if (description !== undefined) existingSeller.description = description;

    // Save the updated seller profile
    await existingSeller.save();
    console.log("Seller profile updated:", existingSeller);

    return res.status(200).json(existingSeller); // Return the updated seller
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating profile" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await productModel.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving products", error: err.message });
  }
});
// GET /tourist/profile/:username - Retrieve tourist profile by username
app.get("/tourist/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;
    console.log("Searching for username:", username);

    // Retrieve tourist by username without password check
    const tourist = await TouristModel.findOne({ username });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Send the profile data (excluding the password)
    const { password, ...profileData } = tourist.toObject(); // Exclude the password
    res.status(200).json(profileData);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error retrieving profile", error: err.message });
  }
});

app.get("/tourist", async (req, res) => {
  try {
    const tourists = await TouristModel.find(); // Fetch all users
    res.status(200).json(tourists); // Return the list of tourists
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error retrieving tourists", error: err.message });
  }
});

// Assuming you have a login endpoint
// Assuming you're using Express
// POST route to login as a tourist

// Ensure you have middleware to parse JSON requests
app.use(express.json());

app.post("/tourist/login", async (req, res) => {
  const { username, password } = req.body; // Removed email from the body

  try {
    // Find the tourist by username only
    const tourist = await TouristModel.findOne({ username });

    if (!tourist) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Validate the password directly (no hashing)
    if (tourist.password !== password) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Login success
    res.status(200).json({ message: "Login successful", tourist });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
app.get("/tourists", async (req, res) => {
  try {
    // Retrieve all tourists from the database
    const tourists = await TouristModel.find(); // Fetch all tourists

    // Check if there are any tourists found
    if (!tourists || tourists.length === 0) {
      console.log("No tourists found."); // Log this for debugging
      return res.status(404).json({ message: "No tourists found." });
    }

    console.log("Found tourists:", tourists); // Log the found tourists
    res.json(tourists); // Send the tourist details
  } catch (err) {
    console.error("Error fetching tourists:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/tourist/profile", async (req, res) => {
  const {
    username,
    email,
    password,
    age,
    nationality,
    mobileNumber,
    work_status,
  } = req.body;

  const existingTourist = await TouristModel.findOne({ username });

  if (existingTourist) {
    existingTourist.email = email || existingTourist.email;
    existingTourist.age = age || existingTourist.age;
    existingTourist.nationality = nationality || existingTourist.nationality;
    existingTourist.mobileNumber = mobileNumber || existingTourist.mobileNumber;
    existingTourist.work_status = work_status || existingTourist.work_status;

    await existingTourist.save();
    console.log("Profile updated:", existingTourist);
    return res.status(200).json(existingTourist);
  }
});

// Update Tourist Profile
app.put("/tourists/:username", async (req, res) => {
  const { username } = req.params;
  const updatedData = req.body;

  try {
    const updatedTourist = await TouristModel.findOneAndUpdate(
      { username },
      updatedData,
      { new: true }
    );

    if (!updatedTourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    res.json({
      message: "Profile updated successfully.",
      tourist: updatedTourist,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile." });
  }
});

app.get("/search", async (req, res) => {
  let { name, category, tag } = req.query;

  // Log the model definitions
  console.log("Place Model:", placeModel);
  console.log("Activity Model:", ActivityModel);

  try {
    const searchResults = {
      historicalPlaces: [],
      activities: [],
      itineraries: [],
    };

    // Searching by name
    if (name) {
      name = name.trim();
      searchResults.historicalPlaces = await placeModel.find({
        name: { $regex: name, $options: "i" },
      });
      searchResults.activities = await ActivityModel.find({
        name: { $regex: name, $options: "i" },
      });
      searchResults.itineraries = await ItineraryModel.find({
        Itinerary_Name: { $regex: name, $options: "i" },
      });
    }

    // Searching by category
    if (category) {
      category = category.trim();
      const categoryResults = await placeModel.find({
        category: { $regex: category, $options: "i" },
      });
      searchResults.historicalPlaces = [
        ...searchResults.historicalPlaces,
        ...categoryResults,
      ];

      const activityResults = await ActivityModel.find({
        category: { $regex: category, $options: "i" },
      });
      searchResults.activities = [
        ...searchResults.activities,
        ...activityResults,
      ];

      const itineraryResults = await ItineraryModel.find({
        preferences: { $regex: category, $options: "i" },
      });
      searchResults.itineraries = [
        ...searchResults.itineraries,
        ...itineraryResults,
      ];
    }

    // Searching by tag
    if (tag) {
      tag = tag.trim();
      const tagResults = await placeModel.find({
        tags: { $regex: tag, $options: "i" },
      });
      searchResults.historicalPlaces = [
        ...searchResults.historicalPlaces,
        ...tagResults,
      ];

      const activityTagResults = await ActivityModel.find({
        tags: { $regex: tag, $options: "i" },
      });
      searchResults.activities = [
        ...searchResults.activities,
        ...activityTagResults,
      ];

      const itineraryTagResults = await ItineraryModel.find({
        activities: { $regex: tag, $options: "i" },
      });
      searchResults.itineraries = [
        ...searchResults.itineraries,
        ...itineraryTagResults,
      ];
    }

    // Remove duplicates by ID (optional)
    searchResults.historicalPlaces = Array.from(
      new Set(searchResults.historicalPlaces.map((a) => a._id))
    ).map((id) => searchResults.historicalPlaces.find((a) => a._id === id));

    searchResults.activities = Array.from(
      new Set(searchResults.activities.map((a) => a._id))
    ).map((id) => searchResults.activities.find((a) => a._id === id));

    searchResults.itineraries = Array.from(
      new Set(searchResults.itineraries.map((a) => a._id))
    ).map((id) => searchResults.itineraries.find((a) => a._id === id));

    res.status(200).json(searchResults);
  } catch (err) {
    res.status(500).json({ message: "Error searching", error: err.message });
  }
});

// Fetch Advertiser Profile
app.get("/advertisers", async (req, res) => {
  try {
    const { username, email, password } = req.query; // Get all three parameters

    // If username, email, and password are provided, filter by them
    const filter = {};
    if (username) filter.username = username;
    if (email) filter.email = email;
    if (password) filter.password = password;

    console.log("Filter:", filter); // Log the filter to see what's being searched

    const advertisers = await AdvertiserModel.find(filter); // Apply the filter

    // Check if there are any advertisers found
    if (advertisers.length === 0) {
      console.log("No advertisers found."); // Log this for debugging
      return res.status(404).json({ message: "No advertisers found." });
    }

    console.log("Found advertisers:", advertisers); // Log the found advertisers
    res.json(advertisers); // Send the advertiser details
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server is not working" });
  }
});

// Update Advertiser Profile
app.put("/advertisers/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the request params
    const { username, email, companyName, hotline, website, companyProfile } =
      req.body;

    // Find the advertiser by ID
    const existingAdvertiser = await AdvertiserModel.findById(id);

    if (existingAdvertiser) {
      // Update fields directly
      if (username) existingAdvertiser.username = username;
      if (email) existingAdvertiser.email = email;
      if (companyName) existingAdvertiser.companyName = companyName;
      if (hotline) existingAdvertiser.hotline = hotline;
      if (website) existingAdvertiser.website = website;
      if (companyProfile) existingAdvertiser.companyProfile = companyProfile;

      await existingAdvertiser.save();
      console.log("Profile updated:", existingAdvertiser);
      return res.status(200).json(existingAdvertiser);
    }

    return res
      .status(404)
      .json({ message: "Advertiser not found. Please check the ID." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server is not working" });
  }
});

// ================== Seiff ================== //
app.get("/ProductByName", async (req, res) => {
  try {
    const { Name } = req.query;

    const products = await productModel.find({
      Name: { $regex: new RegExp(Name, "i") },
    });
    if (products.length >= 1) res.status(200).json(products);
    else res.status(400).json({ message: "product not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/FilterProductByPrice", async (req, res) => {
  const minPrice = parseFloat(req.query.minPrice) || 0; // Default minPrice to 0 if not provided
  const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
  try {
    const products = await productModel.find({
      Price: { $gte: minPrice, $lte: maxPrice },
    });
    if (products.length > 0) res.status(200).json(products);
    else
      res
        .status(400)
        .json({ message: "No products found within the price range" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/getUpcomingActivities", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activities = await ActivityModel.find({
      date: { $gt: today },
    });

    if (activities.length > 0) {
      res.status(200).json(activities);
    } else {
      res.status(404).json({ message: "No upcoming activities found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching activities", error });
  }
});

app.get("/getUpcomingItenraries", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const Itenraries = await ItineraryModel.find({
      date_time: { $gt: today },
    });

    if (Itenraries.length > 0) {
      res.status(200).json(Itenraries);
    } else {
      res.status(404).json({ message: "No upcoming Itenraries found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching Itenraries", error });
  }
});

app.get("/getHistoricalPlaces", async (req, res) => {
  try {
    const HistoricalPlaces = await placeModel.find();

    if (HistoricalPlaces.length > 0) {
      res.status(200).json(HistoricalPlaces);
    } else {
      res.status(404).json({ message: "No HistoricalPlaces found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching HistoricalPlaces", error });
  }
});

app.post("/manageCategory", async (req, res) => {
  try {
    const { Name } = req.body;
    const newCategory = new categoryModel({ Name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/manageCategory", async (req, res) => {
  //retrieve all Categorys from the database
  try {
    const Categorys = await categoryModel.find();
    res.status(200).json(Categorys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/manageCategory", async (req, res) => {
  // Update a Category in the database
  try {
    const { _id, Name } = req.body; // Destructure ID and other fields for update
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      _id,
      { Name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/manageCategory", async (req, res) => {
  //delete a Category from the database
  try {
    const _id = req.body;
    const deletedCategory = await categoryModel.findByIdAndDelete(_id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const filterActivity = async (req, res) => {
  const { startPrice, endPrice, startDate, endDate, category, rating } =
    req.query;

  let filter = {};

  if (startPrice || endPrice) {
    filter.price = {};
    if (startPrice) {
      console.log(`Filtering with startPrice: ${startPrice}`);
      filter.price.$gte = Number(startPrice);
    }
    if (endPrice) {
      console.log(`Filtering with endPrice: ${endPrice}`);
      filter.price.$lte = Number(endPrice);
    }
  }

  if (startDate) {
    filter.date.$gte = new Date(new Date(startDate).setHours(0, 0, 0, 0));
  }
  if (endDate) {
    filter.date = {
      $lt: endDate,
    };
  }

  if (category) {
    filter.category = category;
  }
  if (rating) {
    filter.rating = { $lte: Number(rating) };
  }

  try {
    const activities = await ActivityModel.find(filter);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: "Error fetching activities" });
  }
};

app.get("/filterActivity", filterActivity);

const sortRating = async (req, res) => {
  try {
    const products = await productModel.find().sort({ Ratings: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

app.get("/sortRating", sortRating);

const editProductDetailsPrice = async (req, res) => {
  try {
    const { productId } = req.params;
    const { Description, Name, Quantity, Price } = req.body;
    const product = await productModel.findByIdAndUpdate(
      productId,
      { Description, Name, Quantity, Price },
      { new: true, runValidators: true }
    );
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

app.put("/editProductDetails/:productId", editProductDetailsPrice);

app.get("/itineraries-filter", async (req, res) => {
  const { sortBy, startPrice, endPrice, endDate, preferences, language } =
    req.query;

  // No need to filter on the server side based on active/booked
  let filter = {};

  if (startPrice || endPrice) {
    filter.price = {};
    if (startPrice) {
      console.log(`Filtering with startPrice: ${startPrice}`);
      filter.price.$gte = Number(startPrice);
    }
    if (endPrice) {
      console.log(`Filtering with endPrice: ${endPrice}`);
      filter.price.$lte = Number(endPrice);
    }
  }

  if (endDate) {
    filter.date_time = {
      $lt: endDate,
    };
  }

  if (language) {
    filter.languageOfTour = language;
  }

  if (preferences) {
    const preferenceList = preferences
      .split(",")
      .map((preference) => preference.trim().toLowerCase());
    filter.preferences = { $in: preferenceList };
  }

  let sortQuery = {};
  if (sortBy) {
    if (sortBy === "price") {
      sortQuery = { price: 1 }; // Sort by price ascending
    } else if (sortBy === "rating") {
      sortQuery = { rating: -1 }; // Sort by rating descending
    }
  }

  try {
    const itineraries = await ItineraryModel.find(filter).sort(sortQuery);
    res.json(itineraries);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching itineraries", error: error.message });
  }
});

app.get("/activities-sort", async (req, res) => {
  const { sortBy } = req.query;
  let sortQuery = {};
  let filter = {};
  if (sortBy) {
    filter.date_time = { $gt: new Date() };
    if (sortBy === "price") {
      sortQuery = { price: 1, rating: -1 };
    } else if (sortBy === "rating") {
      sortQuery = { rating: -1, price: 1 };
    } else {
      sortQuery = { price: 1, rating: -1 }; // Default to sorting by price ascending, then by rating descending
    }
  }
  try {
    const activities = await ActivityModel.find().sort(sortQuery); // Apply sorting
    res.json(activities); // Return sorted activities
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching activities", error: error.message });
  }
});

app.get("/historical-places", async (req, res) => {
  console.log("Fetching historical places");
  const { tags } = req.query;
  let filter = {};

  if (tags) {
    const tagList = tags.split(",");
    filter.tags = {
      $in: tagList,
    };
  }

  try {
    const historicalPlaces = await placeModel.find(filter);
    res.json(historicalPlaces);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({
      message: "Error fetching historical places",
      error: error.message,
    });
  }
});

/////////////////////////////admin////////////////////////

// Example: /api/getUserDocuments
app.get("/getUserDocuments", async (req, res) => {
  const { username } = req.query; // get username from query or params
  try {
    const user = await TourGuideModel.findOne({ username });
    if (user) {
      res.json({
        success: true,
        documents: user.documents, // assuming documents field contains paths
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Get method for the uploads
app.get("/upload/:filename", (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, "uploads", filename));
});

const createProduct = async (req, res) => {
  try {
    const newProduct = new productModel({ ...req.body });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { username, Password, email } = req.body;

    const isUnique = await checkUsernameUnique(username);
    if (!isUnique) {
      return res.status(400).json({
        message:
          "Username already exists across stakeholders. Please choose a different one.",
      });
    }

    // Check if the email already exists
    const isEmailUnique = await adminModel.findOne({ email });
    if (isEmailUnique) {
      return res.status(400).json({
        message: "Email already exists. Please choose a different one.",
      });
    }
    const newAdmin = new adminModel({ username, Password, email });
    await newAdmin.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPreference = async (req, res) => {
  //add a new user to the database with
  //Name, Email and Age
  try {
    const { Name } = req.body;
    const newPreference = new preferenceModel({ Name });
    await newPreference.save();
    res.status(201).json(newPreference);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPreference = async (req, res) => {
  //retrieve all Preferences from the database
  try {
    const preferences = await preferenceModel.find();
    res.status(200).json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePreference = async (req, res) => {
  //update a user in the database
  try {
    const id = req.body;
    const update = req.body;
    const updatedPreferences = await preferenceModel.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );
    if (!updatedPreferences) {
      return res.status(404).json({ message: "Preference not found" });
    }
    res.status(200).json(updatedPreferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePreference = async (req, res) => {
  //delete a user from the database
  try {
    const _id = req.body;
    const deletedPreference = await preferenceModel.findByIdAndDelete(_id);
    if (!deletedPreference) {
      return res.status(404).json({ message: "Preference not found" });
    }
    res.status(200).json({ message: "Preference deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTourismGoverner = async (req, res) => {
  try {
    const { username, Password, email } = req.body;

    // Check if the username already exists
    const isUnique = await checkUsernameUnique(username);
    if (!isUnique) {
      return res.status(400).json({
        message:
          "Username already exists across stakeholders. Please choose a different one.",
      });
    }

    const newTourismGoverner = new tourismGovernerModel({
      username,
      Password,
      email,
    });
    await newTourismGoverner.save();
    res.status(201).json(newTourismGoverner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

updateTourGuideStatus = async (req, res) => {
  try {
    const { username, status } = req.body;
    const updatedTourGuide = await TourGuideModel.findOneAndUpdate(
      { username },
      { status },
      { new: true }
    );
    if (!updatedTourGuide) {
      return res.status(404).json({ message: "Tour Guide not found" });
    }
    res.status(200).json(updatedTourGuide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

updateSellerStatus = async (req, res) => {
  try {
    const { username, status } = req.body;
    const updatedSeller = await SellerModel.findOneAndUpdate(
      { username },
      { status },
      { new: true }
    );
    if (!updatedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.status(200).json(updatedSeller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

updateAdvertiserStatus = async (req, res) => {
  try {
    const { username, status } = req.body;
    const updatedAdvertiser = await AdvertiserModel.findOneAndUpdate(
      { username },
      { status },
      { new: true }
    );
    if (!updatedAdvertiser) {
      return res.status(404).json({ message: "Advertiser not found" });
    }
    res.status(200).json(updatedAdvertiser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { Name } = req.body;
    const newCategory = new categoryModel({ Name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategory = async (req, res) => {
  //retrieve all Categorys from the database
  try {
    const Categorys = await categoryModel.find();
    res.status(200).json(Categorys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  //update a Category in the database
  try {
    const id = req.body;
    const update = req.body;
    const updatedCategory = await categoryModel.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  //delete a Category from the database
  try {
    const _id = req.body;
    const deletedCategory = await categoryModel.findByIdAndDelete(_id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

app.post("/adminlogin", async (req, res) => {
  const { username, Password } = req.body;
  console.log(username, Password);
  try {
    const admin = await adminModel.findOne({ username });

    // If admin is not found
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Check if the provided password matches the stored password
    if (admin.Password !== Password) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // If everything matches, send the admin data (without the password)
    res.status(200).json({ message: "Login successful", admin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // Add this for debugging
});

// Add a verification test
transporter.verify(function (error, success) {
  if (error) {
    console.log("Email configuration error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

const sendFlagNotificationEmail = async (tourGuideEmail, itineraryName) => {
  console.log("Attempting to send email to:", tourGuideEmail);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: tourGuideEmail,
    subject: "Itinerary Flagged as Inappropriate",
    html: `
      <h2>Itinerary Flagged Notice</h2>
      <p>Your itinerary "${itineraryName}" has been flagged as inappropriate.</p>
      <p>Please review your itinerary content and make necessary adjustments.</p>
      <p>If you believe this was done in error, please contact support.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// In app.js
app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: "Test Email",
      text: "If you receive this, email is working!",
    });
    res.send("Test email sent!");
  } catch (error) {
    console.error("Email test failed:", error);
    res.status(500).send(error.toString());
  }
});

const sendFlagNotificationEmailActivity = async (
  advertiserEmail,
  activityName
) => {
  console.log("Attempting to send activity flag email to:", advertiserEmail);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: advertiserEmail,
    subject: "Activity Flagged as Inappropriate",
    html: `
      <h2>Activity Flagged Notice</h2>
      <p>Your activity "${activityName}" has been flagged as inappropriate.</p>
      <p>Please review your activity content and make necessary adjustments.</p>
      <p>If you believe this was done in error, please contact support.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Activity flag notification email sent:", info);
    return true;
  } catch (error) {
    console.error("Error sending activity flag notification email:", error);
    return false;
  }
};

// In app.js - Add new endpoint
// In app.js
app.get("/user-counts", async (req, res) => {
  try {
    // Get current month's start date
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get total counts
    const tourists = await TouristModel.countDocuments();
    const tourGuides = await TourGuideModel.countDocuments();
    const advertisers = await AdvertiserModel.countDocuments();
    const sellers = await SellerModel.countDocuments();
    const tourismGoverners = await tourismGovernerModel.countDocuments();

    // Calculate total
    const total =
      tourists + tourGuides + advertisers + sellers + tourismGoverners;

    // Get new users this month using ObjectId timestamp
    const getDateFromObjectId = (objectId) => {
      return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    };

    const allTourists = await TouristModel.find({}, "_id");
    const allTourGuides = await TourGuideModel.find({}, "_id");
    const allAdvertisers = await AdvertiserModel.find({}, "_id");
    const allSellers = await SellerModel.find({}, "_id");
    const allGovernors = await tourismGovernerModel.find({}, "_id");

    const newTourists = allTourists.filter(
      (t) => getDateFromObjectId(t._id.toString()) >= monthStart
    ).length;
    const newTourGuides = allTourGuides.filter(
      (t) => getDateFromObjectId(t._id.toString()) >= monthStart
    ).length;
    const newAdvertisers = allAdvertisers.filter(
      (t) => getDateFromObjectId(t._id.toString()) >= monthStart
    ).length;
    const newSellers = allSellers.filter(
      (t) => getDateFromObjectId(t._id.toString()) >= monthStart
    ).length;
    const newGovernors = allGovernors.filter(
      (t) => getDateFromObjectId(t._id.toString()) >= monthStart
    ).length;

    const newTotal =
      newTourists + newTourGuides + newAdvertisers + newSellers + newGovernors;

    res.json({
      total: {
        total,
        tourists,
        tourGuides,
        advertisers,
        sellers,
        tourismGoverners,
      },
      newThisMonth: {
        total: newTotal,
        tourists: newTourists,
        tourGuides: newTourGuides,
        advertisers: newAdvertisers,
        sellers: newSellers,
        tourismGoverners: newGovernors,
      },
    });
  } catch (error) {
    console.error("Error getting user counts:", error);
    res.status(500).json({ message: "Error fetching user counts" });
  }
});

//////////////////////////////////////////////////////////////deleteAccount///////////////////////////////////////////////
const deleteAccount = async (req, res) => {
  const { category, username } = req.body;

  // Validate input
  if (!category || !username) {
    return res
      .status(400)
      .json({ message: "Category and username are required." });
  }

  try {
    switch (category.toLowerCase()) {
      case "seller":
        // Delete Seller Account
        const seller = await SellerModel.findOneAndDelete({ username });
        if (!seller) {
          return res.status(404).json({ message: "Seller not found." });
        }
        // Delete all products created by the seller
        await productModel.deleteMany({ sellerUsername: username });
        break;

      case "tour guide":
        // Delete Tour Guide Account
        const tourGuide = await TourGuideModel.findOneAndDelete({ username });
        if (!tourGuide) {
          return res.status(404).json({ message: "Tour Guide not found." });
        }
        // Delete all itineraries created by the tour guide
        await ItineraryModel.deleteMany({ tourGuideName: username });
        break;

      case "tourism governor":
        // Delete Tourism Governor Account
        const tourismGovernor = await tourismGovernerModel.findOneAndDelete({
          username: username,
        });
        if (!tourismGovernor) {
          return res
            .status(404)
            .json({ message: "Tourism Governer not found." });
        }
        // Delete all historical places created by the governor
        await placeModel.deleteMany({ governorUsername: username });
        break;

      case "advertiser":
        // Delete Advertiser Account
        const advertiser = await AdvertiserModel.findOneAndDelete({ username });
        if (!advertiser) {
          return res.status(404).json({ message: "Advertiser not found." });
        }
        // Delete all activities created by the advertiser
        await ActivityModel.deleteMany({ advertiserUsername: username });
        break;

      case "guest":
        // Delete Guest Account
        const guest = await TouristModel.findOneAndDelete({ username });
        if (!guest) {
          return res.status(404).json({ message: "Guest not found." });
        }
        break;

      default:
        return res.status(400).json({ message: "Invalid category provided." });
    }

    res.status(200).json({
      message: `${category} account and associated data deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the account." });
  }
};

app.post("/manageCategory", async (req, res) => {
  try {
    const { Name } = req.body;
    const newCategory = new categoryModel({ Name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/manageCategory", async (req, res) => {
  //retrieve all Categorys from the database
  try {
    const Categorys = await categoryModel.find();
    res.status(200).json(Categorys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/manageCategory", async (req, res) => {
  // Update a Category in the database
  try {
    const { _id, Name } = req.body; // Destructure ID and other fields for update
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      _id,
      { Name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/manageCategory", async (req, res) => {
  //delete a Category from the database
  try {
    const _id = req.body;
    const deletedCategory = await categoryModel.findByIdAndDelete(_id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/createProduct", createProduct);
app.post("/createPreference", createPreference);
app.post("/createAdmin", createAdmin);
app.put("/updatePreference", updatePreference);
app.get("/getPreference", getPreference);
app.delete("/deletePreference", deletePreference);
app.delete("/deleteAccount", deleteAccount);
app.post("/createTourismGoverner", createTourismGoverner);
app.put("/updateTourGuideStatus", updateTourGuideStatus);
app.put("/updateSellerStatus", updateSellerStatus);
app.put("/updateAdvertiserStatus", updateAdvertiserStatus);

app.post("/managePreference", async (req, res) => {
  try {
    const { Name } = req.body;
    const newPreference = new PreferenceModel({ Name });
    await newPreference.save();
    res.status(201).json(newPreference);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/managePreference", async (req, res) => {
  //retrieve all Categorys from the database
  try {
    const Preferences = await PreferenceModel.find();
    res.status(200).json(Preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/managePreference", async (req, res) => {
  // Update a Category in the database
  try {
    const { _id, Name } = req.body; // Destructure ID and other fields for update
    const updatedPreferences = await PreferenceModel.findByIdAndUpdate(
      _id,
      { Name },
      { new: true, runValidators: true }
    );

    if (!updatedPreferences) {
      return res.status(404).json({ message: "Preference not found" });
    }

    res.status(200).json(updatedPreferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/managePreference", async (req, res) => {
  //delete a Category from the database
  try {
    const _id = req.body;
    const deletedPreference = await PreferenceModel.findByIdAndDelete(_id);
    if (!deletedPreference) {
      return res.status(404).json({ message: "Preference not found" });
    }
    res.status(200).json({ message: "Preference deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//////////////////////////////////Sprint2//////////////////////////////////
app.put("/tour_guide/change-password", async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;

    // Find the existing tour guide based on username or email
    const existingTourGuide = await TourGuideModel.findOne({ username, email });

    if (existingTourGuide) {
      // Verify the current password
      if (existingTourGuide.password !== currentPassword) {
        return res.status(401).json({ message: "Incorrect current password." });
      }

      // Update password
      existingTourGuide.password = newPassword; // Update with the new password
      await existingTourGuide.save(); // Save the changes

      console.log("Password updated for user:", existingTourGuide.username);
      return res
        .status(200)
        .json({ message: "Password updated successfully." });
    }

    return res
      .status(404)
      .json({ message: "User does not exist. Please check your credentials." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server is not working" });
  }
});
app.put("/sellers/change-password", async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;

    const seller = await SellerModel.findOne({ username, email });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found." });
    }

    // Verify current password
    if (seller.password !== currentPassword) {
      return res.status(401).json({ message: "Incorrect current password." });
    }

    // Update the password
    seller.password = newPassword;
    await seller.save();

    console.log("Seller password updated:", seller);
    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

app.put("/advertisers/change-password", async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;

    // Find the advertiser based on username
    const existingAdvertiser = await AdvertiserModel.findOne({ username });

    if (!existingAdvertiser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the current password is correct
    if (existingAdvertiser.password !== currentPassword) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    // Update the password directly
    existingAdvertiser.password = newPassword; // Make sure to hash this password if you're using hashing
    await existingAdvertiser.save();

    console.log("Password updated successfully for:", username);
    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

app.put("/tourist/change-password", async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    console.log("Request Body:", req.body);
    console.log("Received username:", username);

    // Input validation
    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingTourist = await TouristModel.findOne({ username: username });
    if (!existingTourist) {
      console.log("User not found:", username);
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the current password is correct
    if (existingTourist.password !== currentPassword) {
      console.log("Current password is incorrect for:", username);
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    // Update the password directly (without hashing)
    existingTourist.password = newPassword;
    await existingTourist.save();

    console.log("Password updated successfully for:", username);
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    console.error("Error occurred while changing password:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

app.put("/admin/change-password", async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the entire request body for debugging
    const { username, currentPassword, newPassword } = req.body; // Ensure correct destructuring

    console.log("Received username:", username); // Log received username

    // Find the admin by username
    const admin = await adminModel.findOne({ username }); // Use 'Username' to match your schema

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // Directly compare passwords
    if (admin.Password !== currentPassword) {
      return res.status(401).json({ message: "Incorrect current password." });
    }

    // Update to new password
    admin.Password = newPassword;
    await admin.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

////////////////////SEIF//////////////////////////////////
// Endpoint to get tourist with populated purchased items
app.get("/tourists/purchasedItems/:id", async (req, res) => {
  try {
    const tourist = await TouristModel.findById(req.params.id).populate(
      "purchasedItems.product"
    ); // Populate purchasedItems with Product details

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.json(tourist.purchasedItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/tourists/rateProduct/:touristId", async (req, res) => {
  const { productId, rating } = req.body; // Get product ID and rating from the request body

  // Validate input
  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return res.status(400).json({
      message: "Invalid rating value. Rating must be a number between 1 and 5.",
    });
  }

  try {
    // Find the product and update its ratings
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Push the new rating to the AllRating array
    product.AllRatings.push(rating);

    // Update the average rating
    const totalRatings = product.AllRatings.reduce(
      (acc, curr) => acc + curr,
      0
    );
    product.Ratings = totalRatings / product.AllRatings.length; // Calculate new average

    // Save the updated product
    await product.save();

    return res.status(200).json(product); // Respond with the updated product
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/tourists/reviewProduct/:touristId", async (req, res) => {
  const { productId, review } = req.body; // Get product ID and rating from the request body

  try {
    // Find the product and update its ratings
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Push the new rating to the AllRating array
    product.Reviews.push(review);

    // Save the updated product
    await product.save();

    return res.status(200).json(product); // Respond with the updated product
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/tourist/purchase", async (req, res) => {
  const { touristId, productId, quantity } = req.body;
  try {
    // Find the tourist by ID
    const tourist = await TouristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the product by ID
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (tourist.wallet < quantity * product.Price) {
      return res.status(404).json({ message: "Not enough money in wallet" });
    }

    // Check if the requested quantity is available
    if (quantity > product.Quantity) {
      return res
        .status(400)
        .json({ message: "Exceeded the available quantity" });
    }

    // Decrease product quantity
    product.Quantity -= quantity;
    product.Sold += quantity;

    await product.save();

    const existingPurchase = tourist.purchasedItems.find(
      (item) => item && item.product && item.product.equals(productId)
    );

    if (existingPurchase) {
      // Increment quantity if item already exists
      existingPurchase.quantity += quantity;
    } else {
      // Add item with initial quantity if it doesn't exist
      tourist.purchasedItems.push({ product: productId, quantity });
    }
    tourist.wallet = tourist.wallet - quantity * product.Price;
    await tourist.save();

    const seller = await SellerModel.findById(product.sellerId);
    const admins = await adminModel.find();

    if (product.Quantity === 0) {
      const transporter = nodemailer.createTransport({
        service: "gmail", // or your email provider
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const adminEmails = admins.map((admin) => admin.email);

      const mailOptionsForAdmins = {
        from: process.env.EMAIL_USER,
        to: adminEmails.join(","), // Join emails into a comma-separated string
        subject: `Admin Alert: Product "${product.Name}" is out of stock`,
        text: `Dear Admins,\n\nThe product "${product.Name}" is now out of stock. Please coordinate with the seller (${seller.name}, ${seller.email}) to restock it as soon as possible.\n\nRegards,\nYour Store Team`,
      };

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: seller.email, // Assuming `sellerEmail` is part of the Product model
        subject: `Stock Alert: ${product.Name} is out of stock`,
        html: `
        <p style="color: #333333; font-size: 16px;">Dear <strong>${seller.name}</strong>,</p>
        <p style="color: #ff0000;">The product "<strong>${product.Name}</strong>" is now out of stock.</p>
        <p>Please restock it as soon as possible.</p>
        <p style="color: #333333;">Regards,</p>
        <p style="color: #333333;">Your Store Team</p>
      `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Stock alert email sent to seller.");

      await transporter.sendMail(mailOptionsForAdmins);
      console.log("Emails sent to admins successfully.");
    }
    return res.status(200).json({
      message: "Purchase successful",
      product,
      purchasedItems: tourist.purchasedItems,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/tourist/attendedActivities/:id", async (req, res) => {
  try {
    // Retrieve the tourist's activities and populate the bookedActivities field
    const tourist = await TouristModel.findById(req.params.id).populate(
      "bookedActivities"
    );

    // Debugging statements
    console.log("Tourist:", tourist);
    if (tourist) {
      console.log("bookedActivities:", tourist.bookedActivities);
    }

    if (!tourist) {
      return res.status(400).json({ message: "Tourist not found" });
    }

    if (!tourist.bookedActivities || tourist.bookedActivities.length === 0) {
      return res.status(400).json({ message: "No booked activities found" });
    }

    // Get the current date (midnight to make date-only comparison easier)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter bookedActivities to find those where the date has passed
    const attendedActivities = tourist.bookedActivities.filter((activity) => {
      const activityDate = new Date(activity.date); // assuming activity has a date field
      activityDate.setHours(0, 0, 0, 0);
      return activityDate < today; // check if the activity date is in the past
    });

    // Update the tourist's attendedActivities in the database
    tourist.attendedActivities = attendedActivities;
    await tourist.save();

    // Send the attended activities as a response
    res.status(200).json(attendedActivities);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/tourists/rateActivityAttended/:touristId", async (req, res) => {
  const { activityId, rating } = req.body;

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return res.status(400).json({
      message: "Invalid rating value. Rating must be a number between 1 and 5.",
    });
  }
  try {
    // Find the activity and update its ratings
    const activity = await ActivityModel.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Push the new rating to the AllRating array
    activity.AllRatings.push(rating);

    // Update the average rating
    const totalRatings = activity.AllRatings.reduce(
      (acc, curr) => acc + curr,
      0
    );
    activity.rating = totalRatings / activity.AllRatings.length; // Calculate new average

    // Save the updated activity
    await activity.save();

    return res.status(200).json(activity); // Respond with the updated activity
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/tourists/commentActivity/:touristId", async (req, res) => {
  const { activityId, comment } = req.body; // Get product ID and rating from the request body

  try {
    // Find the product and update its ratings
    const activity = await ActivityModel.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Push the new rating to the AllRating array
    activity.comments.push(comment);

    // Save the updated product
    await activity.save();

    return res.status(200).json(activity); // Respond with the updated product
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

////////////////////END SEIF//////////////////////////////////

app.put("/updateStatus", async (req, res) => {
  const { username, status, category } = req.body;

  try {
    let model;

    // Determine the collection to update based on the category
    switch (category) {
      case "tour_guide":
        model = TourGuide;
        break;
      case "seller":
        model = Seller;
        break;
      case "advertiser":
        model = Advertiser;
        break;
      default:
        return res.status(400).json({ error: "Invalid category" });
    }

    // Find and update the document
    const result = await model.findOneAndUpdate(
      { username },
      { status },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Status updated successfully", updatedUser: result });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

///////////////complaints////////////////////////

app.post("/complaints", async (req, res) => {
  try {
    const { TouristUsername, Title, Body, Date } = req.body; // Destructure username from request body
    const newComplaint = new ComplaintModel({
      TouristUsername, // Store the username in the complaint
      Title,
      Body,
      Date,
    });
    await newComplaint.save();
    console.log(newComplaint);
    res.status(201).json({
      message: "Complaint filed successfully",
      complaint: newComplaint,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all complaints with tourist data populated
app.get("/complaints", async (req, res) => {
  const complaints = await ComplaintModel.find();
  res.json(complaints);
});

// Update status
app.put("/complaints/:id/status", async (req, res) => {
  const { status } = req.body;
  const complaint = await ComplaintModel.findByIdAndUpdate(
    req.params.id,
    { Status: status },
    { new: true }
  );
  res.json(complaint);
});

// Send reply
app.post("/complaints/:id/reply", async (req, res) => {
  const { message } = req.body;
  try {
    const complaint = await ComplaintModel.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    complaint.Reply = message;
    await complaint.save();

    res.json({ success: true, message: "Reply sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

///archive///
// Archive product
app.put("/archive/:id", async (req, res) => {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to archive product" });
  }
});

// Unarchive product
app.put("/unarchive/:id", async (req, res) => {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      { isArchived: false },
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to unarchive product" });
  }
});

// Get all archived products
app.get("/archived-products", async (req, res) => {
  try {
    const archivedProducts = await productModel.find({ isArchived: true });
    res.json(archivedProducts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch archived products" });
  }
});
app.post("/tourism-governor/change-password", async (req, res) => {
  const { username, newPassword } = req.body;

  try {
    // Update the password for the specified Username
    const updatedGovernor = await tourismGovernerModel.findOneAndUpdate(
      { username },
      { Password: newPassword },
      { new: true }
    );

    if (updatedGovernor) {
      res.status(200).json({ message: "Password updated successfully." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Activate an itinerary if not booked
const activateItinerary = async (req, res) => {
  try {
    const itinerary = await ItineraryModel.findById(req.params.id);

    if (!itinerary) {
      console.error("Itinerary not found with ID:", req.params.id);
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Check if itinerary is already booked
    if (itinerary.booked) {
      console.error("Cannot activate booked itinerary:", req.params.id);
      return res
        .status(400)
        .json({ message: "Cannot activate a booked itinerary" });
    }

    // Activate the itinerary
    itinerary.active = true;
    await itinerary.save();

    console.log("Itinerary activated successfully:", req.params.id);
    res
      .status(200)
      .json({ message: "Itinerary activated successfully", itinerary });
  } catch (error) {
    console.error("Error activating itinerary:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Deactivate an itinerary
const deactivateItinerary = async (req, res) => {
  try {
    const itinerary = await ItineraryModel.findById(req.params.id);

    if (!itinerary) {
      console.error("Itinerary not found with ID:", req.params.id);
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // If booked, allow only deactivation, not reactivation
    if (itinerary.booked && itinerary.active === false) {
      console.error("Itinerary is already inactive and booked:", req.params.id);
      return res.status(400).json({ message: "Itinerary is already inactive" });
    }

    // Deactivate the itinerary
    itinerary.active = false;
    await itinerary.save();

    console.log("Itinerary deactivated successfully:", req.params.id);
    res
      .status(200)
      .json({ message: "Itinerary deactivated successfully", itinerary });
  } catch (error) {
    console.error("Error deactivating itinerary:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Set up the routes
app.put("/itinerary/:id/activate", activateItinerary);
app.put("/itinerary/:id/deactivate", deactivateItinerary);

//rate tour guide
app.put("/rate-tour-guide/:id", async (req, res) => {
  const { rating } = req.body;
  try {
    const tourGuide = await TourGuideModel.findById(req.params.id);

    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    tourGuide.totalRating.push(rating);

    const totalRatingsCount = tourGuide.totalRating.length;
    const averageRating =
      tourGuide.totalRating.reduce((sum, r) => sum + r, 0) / totalRatingsCount;

    tourGuide.rating = averageRating;

    await tourGuide.save();

    res.status(200).json({
      message: "Tour guide rated successfully",
      updatedTourGuide: tourGuide,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//comment tour guide
app.put("/comment-tour-guide/:id", async (req, res) => {
  const { comment } = req.body;

  try {
    const tourGuide = await TourGuideModel.findById(req.params.id);
    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found" });
    }

    tourGuide.comments.push(comment);

    await tourGuide.save();

    res
      .status(200)
      .json({ message: "commented successfully", updatedTourGuide: tourGuide });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//rate itinerary
app.put("/rate-itinerary/:id", async (req, res) => {
  const { rating } = req.body;
  try {
    const itinerary = await ItineraryModel.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    itinerary.totalRating.push(rating);

    const totalRatingsCount = itinerary.totalRating.length;
    const averageRating =
      itinerary.totalRating.reduce((sum, r) => sum + r, 0) / totalRatingsCount;

    itinerary.rating = averageRating;

    await itinerary.save();

    res.status(200).json({
      message: "Itinerary rated successfully",
      updatedItinerary: itinerary,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//comment Itinerary
app.put("/comment-itinerary/:id", async (req, res) => {
  const { comment } = req.body;

  try {
    const itinerary = await ItineraryModel.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    itinerary.comments.push(comment);

    await itinerary.save();

    res
      .status(200)
      .json({ message: "commented successfully", updatedItinerary: itinerary });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// booking itineraries
app.post("/itineraries/book-itinerary", async (req, res) => {
  const { Itinerary_Name, username } = req.body;

  try {
    // Find the itinerary to get its price
    const itinerary = await ItineraryModel.findOne({
      Itinerary_Name,
      booked: false,
    });
    if (!itinerary) {
      return res
        .status(404)
        .json({ message: "Itinerary not found or already booked." });
    }

    // Find the tourist to get the wallet balance and current points
    const tourist = await TouristModel.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }
    const isEligible = tourist.canBook();
    if (!isEligible) {
      return res
        .status(404)
        .json({ message: "Tourist is less than 18 years old" });
    }

    // Check if the tourist has enough balance
    if (tourist.wallet < itinerary.price) {
      return res
        .status(400)
        .json({ message: "Insufficient balance in wallet." });
    }

    // Deduct the price from the wallet
    tourist.wallet -= itinerary.price;

    // Calculate loyalty points based on tourist's level
    let pointsMultiplier;
    switch (tourist.level) {
      case 1:
        pointsMultiplier = 0.5;
        break;
      case 2:
        pointsMultiplier = 1.0;
        break;
      case 3:
        pointsMultiplier = 1.5;
        break;
      default:
        pointsMultiplier = 1.0;
    }

    // Add points earned to the tourist's points
    const loyaltyPoints = itinerary.price * pointsMultiplier;
    tourist.loyaltyPoints += loyaltyPoints;

    // Update tourist's level based on new points
    if (tourist.loyaltyPoints > 500000) {
      tourist.level = 3;
    } else if (tourist.loyaltyPoints > 100000) {
      tourist.level = 2;
    } else {
      tourist.level = 1;
    }

    // Save the updated tourist data
    await tourist.save();

    // Update the itinerary as booked and set `bookingOpen` to false
    const updatedItinerary = await ItineraryModel.findOneAndUpdate(
      { Itinerary_Name, booked: false },
      { booked: true, bookedBy: username },
      { new: true }
    );

    res.status(200).json({
      message: "Itinerary booked successfully and loyalty points awarded!",
      updatedItinerary,
    });
  } catch (error) {
    console.error("Error booking itinerary:", error);
    res.status(500).json({ message: "Error booking itinerary." });
  }
});

app.get("/itineraries/booked", async (req, res) => {
  try {
    // Fetch all itineraries that are booked
    const bookedItineraries = await ItineraryModel.find({ booked: true });

    // Check if there are any booked itineraries
    if (bookedItineraries.length === 0) {
      return res.status(404).json({ message: "No booked itineraries found." });
    }

    // Send the booked itineraries back as a response
    res.json(bookedItineraries);
  } catch (error) {
    console.error("Error fetching booked itineraries:", error);
    res.status(500).json({ message: "Error fetching booked itineraries" });
  }
});

app.post("/activities/book-activity", async (req, res) => {
  const { name, username, totalPrice } = req.body;

  try {
    // Find the activity by name and ensure it's open for booking
    const activity = await Activity.findOne({ name, bookingOpen: true });
    if (!activity) {
      return res
        .status(404)
        .json({ message: "Activity not found or already booked." });
    }

    // Find the tourist by username
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }
    const isEligible = tourist.canBook();
    if (!isEligible) {
      return res
        .status(404)
        .json({ message: "Tourist is less than 18 years old" });
    }

    // Check if the tourist has enough wallet balance
    if (tourist.wallet < totalPrice) {
      return res.status(400).json({ message: "Insufficient wallet balance." });
    }

    // Deduct the price from the tourist's wallet
    tourist.wallet -= totalPrice;

    // Calculate loyalty points based on the level
    let pointsMultiplier;
    switch (tourist.level) {
      case 1:
        pointsMultiplier = 0.5;
        break;
      case 2:
        pointsMultiplier = 1.0;
        break;
      case 3:
        pointsMultiplier = 1.5;
        break;
      default:
        pointsMultiplier = 1.0; // Default to level 2 rate if level is out of range
    }
    const loyaltyPoints = totalPrice * pointsMultiplier;
    tourist.loyaltyPoints += loyaltyPoints;

    // Update the level based on the new loyalty points total
    if (tourist.loyaltyPoints <= 100000) {
      tourist.level = 1;
    } else if (tourist.loyaltyPoints <= 500000) {
      tourist.level = 2;
    } else {
      tourist.level = 3;
    }

    // Update the activity as booked and associate it with the user
    tourist.bookedActivities.push(activity);
    activity.bookedBy.push(username);

    // Save changes to both activity and tourist
    await Promise.all([activity.save(), tourist.save()]);

    res.status(200).json({
      message: "Activity booked successfully and loyalty points awarded!",
      updatedActivity: activity,
      newWalletBalance: tourist.wallet,
      newLoyaltyPoints: tourist.loyaltyPoints,
      newLevel: tourist.level,
    });
  } catch (error) {
    console.error("Error booking activity:", error);
    res.status(500).json({ message: "Failed to book activity." });
  }
});
app.post("/activities/book-activity-with-card", async (req, res) => {
  //di lw wallet payment

  try {
    // Find the activity by name and ensure it's open for booking
    const { name, username } = req.body;
    console.log(req.body);
    const activity = await Activity.findOne({ name, bookingOpen: true });
    if (!activity) {
      console.log("no activity");
      return res
        .status(404)
        .json({ message: "Activity not found or already booked." });
    }

    // Find the tourist by username
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }
    const isEligible = tourist.canBook();
    if (!isEligible) {
      return res
        .status(404)
        .json({ message: "Tourist is less than 18 years old" });
    }

    // Calculate loyalty points based on the level
    let pointsMultiplier;
    switch (tourist.level) {
      case 1:
        pointsMultiplier = 0.5;
        break;
      case 2:
        pointsMultiplier = 1.0;
        break;
      case 3:
        pointsMultiplier = 1.5;
        break;
      default:
        pointsMultiplier = 1.0; // Default to level 2 rate if level is out of range
    }
    const loyaltyPoints = activity.price * pointsMultiplier;
    tourist.loyaltyPoints += loyaltyPoints;

    // Update the level based on the new loyalty points total
    if (tourist.loyaltyPoints <= 100000) {
      tourist.level = 1;
    } else if (tourist.loyaltyPoints <= 500000) {
      tourist.level = 2;
    } else {
      tourist.level = 3;
    }

    // Update the activity as booked and associate it with the user
    tourist.bookedActivities.push(activity);
    activity.bookedBy.push(username);

    // Save changes to both activity and tourist
    await Promise.all([activity.save(), tourist.save()]);

    res.status(200).json({
      message: "Activity booked successfully and loyalty points awarded!",
      updatedActivity: activity,
      newLoyaltyPoints: tourist.loyaltyPoints,
      newLevel: tourist.level,
    });
  } catch (error) {
    console.error("Error booking activity:", error);
    res.status(500).json({ message: "Failed to book activity." });
  }
});
app.post("/itineraries/book-itinerary-with-card", async (req, res) => {
  try {
    // Find the itinerary to get its price
    const { Itinerary_Name, username } = req.body;
    const itinerary = await ItineraryModel.findOne({
      Itinerary_Name,
      booked: false,
    });
    if (!itinerary) {
      return res
        .status(404)
        .json({ message: "Itinerary not found or already booked." });
    }

    // Find the tourist to get current points
    const tourist = await TouristModel.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }
    const isEligible = tourist.canBook();
    if (!isEligible) {
      return res
        .status(404)
        .json({ message: "Tourist is less than 18 years old" });
    }

    // Calculate loyalty points based on tourist's level
    let pointsMultiplier;
    switch (tourist.level) {
      case 1:
        pointsMultiplier = 0.5;
        break;
      case 2:
        pointsMultiplier = 1.0;
        break;
      case 3:
        pointsMultiplier = 1.5;
        break;
      default:
        pointsMultiplier = 1.0;
    }

    // Add points earned to the tourist's points
    const loyaltyPoints = itinerary.price * pointsMultiplier;
    tourist.loyaltyPoints += loyaltyPoints;

    // Update tourist's level based on new points
    if (tourist.loyaltyPoints > 500000) {
      tourist.level = 3;
    } else if (tourist.loyaltyPoints > 100000) {
      tourist.level = 2;
    } else {
      tourist.level = 1;
    }

    // Save the updated tourist data
    await tourist.save();

    // Update the itinerary as booked and set `bookingOpen` to false
    const updatedItinerary = await ItineraryModel.findOneAndUpdate(
      { Itinerary_Name, booked: false },
      { booked: true, bookedBy: username },
      { new: true }
    );

    res.status(200).json({
      message: "Itinerary booked successfully and loyalty points awarded!",
      updatedItinerary,
    });
  } catch (error) {
    console.error("Error booking itinerary:", error);
    res.status(500).json({ message: "Error booking itinerary." });
  }
});
app.get("/activities/booked", async (req, res) => {
  try {
    const bookedActivities = await Activity.find({
      bookingOpen: false,
      bookedBy: { $exists: true },
    });
    if (bookedActivities.length === 0) {
      return res.status(404).json({ message: "No booked activities found." });
    }
    res.json(bookedActivities);
  } catch (error) {
    console.error("Error fetching booked activities:", error);
    res.status(500).json({ message: "Error fetching booked activities." });
  }
});

//  Account Deletion Request
app.post("/request-account-deletion", async (req, res) => {
  try {
    const { Username, status, requestDate } = req.body; // Destructure username from request body
    if (!Username || typeof Username !== "string") {
      return res.status(400).json({ message: "Invalid or missing Username." });
    }
    const newRequest = new AccountDeletionRequest({
      Username, // Store the username in the complaint
      status: status || "pending",
      requestDate: requestDate || new Date(),
    });
    await newRequest.save();
    res.status(200).json({
      message: "Account deletion request submitted successfully.",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error creating deletion request:", error);
    res.status(500).json({
      message: "Failed to submit deletion request. Please try again later.",
    });
  }
});

app.get("/Requests", async (req, res) => {
  try {
    const requests = await AccountDeletionRequest.find(); // Retrieve all requests
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Failed to fetch requests." });
  }
});

// DELETE ACCOUNT FUNCTION
const deleteAccount2 = async (username) => {
  if (!username || typeof username !== "string") {
    throw new Error("Invalid or missing username.");
  }

  try {
    const models = [
      {
        name: "Seller",
        model: SellerModel,
        cleanup: async () => {
          await productModel.deleteMany({ sellerUsername: username });
        },
      },
      {
        name: "Tour Guide",
        model: TourGuideModel,
        cleanup: async () => {
          await ItineraryModel.deleteMany({ tourGuideName: username });
        },
      },
      {
        name: "Tourism Governor",
        model: tourismGovernerModel,
        cleanup: async () => {
          await placeModel.deleteMany({ governorUsername: username });
        },
      },
      {
        name: "Advertiser",
        model: AdvertiserModel,
        cleanup: async () => {
          await ActivityModel.deleteMany({ advertiserUsername: username });
        },
      },
      {
        name: "Guest",
        model: TouristModel,
        cleanup: async () => {}, // No additional cleanup for guests
      },
    ];

    for (const { name, model, cleanup } of models) {
      const user = await model.findOneAndDelete({ username });
      if (user) {
        await cleanup(); // Perform associated cleanup tasks
        return `${name} account and associated data deleted successfully.`;
      }
    }

    return "User not found in any category.";
  } catch (error) {
    console.error("Error deleting account:", error);
    throw new Error("An error occurred while deleting the account.");
  }
};

app.put("/Requests/status", async (req, res) => {
  const { Username, status } = req.body;

  if (!Username || typeof Username !== "string") {
    return res.status(400).json({ message: "Invalid or missing Username." });
  }

  if (!["pending", "accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    const request = await AccountDeletionRequest.findOneAndUpdate(
      {
        Username: { $regex: new RegExp(`^${Username}$`, "i") },
        status: "pending",
      },
      { status, responseDate: new Date() },
      { new: true }
    );

    if (!request) {
      return res
        .status(404)
        .json({ message: "Request not found or already processed." });
    }

    if (status === "accepted") {
      const deleteMessage = await deleteAccount2(Username);
      return res.status(200).json({
        message: `Request accepted. ${deleteMessage}`,
      });
    }

    res.status(200).json({ message: `Request ${status} successfully.` });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Failed to update the request status." });
  }
});

// Redeem Points
app.post("/tourist/redeem-points", async (req, res) => {
  const { username } = req.body;

  try {
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    // Calculate redeemable cash and points to redeem
    const pointsToEGPConversion = 10000;
    const redeemableCash =
      Math.floor(tourist.loyaltyPoints / pointsToEGPConversion) * 100;
    const redeemedPoints = (redeemableCash * pointsToEGPConversion) / 100;

    if (redeemableCash === 0) {
      return res
        .status(400)
        .json({ message: "Insufficient points to redeem." });
    }

    // Update wallet and loyalty points
    tourist.wallet += redeemableCash;
    tourist.loyaltyPoints -= redeemedPoints;

    // Determine new level based on remaining points
    if (tourist.loyaltyPoints <= 100000) {
      tourist.level = 1;
    } else if (tourist.loyaltyPoints <= 500000) {
      tourist.level = 2;
    } else {
      tourist.level = 3;
    }

    await tourist.save();

    res.status(200).json({
      message: "Points redeemed successfully!",
      newWalletBalance: tourist.wallet,
      remainingPoints: tourist.loyaltyPoints,
      newlevel: tourist.level,
    });
  } catch (error) {
    console.error("Error redeeming points:", error);
    res.status(500).json({ message: "Failed to redeem points." });
  }
});

app.get("/search-username", async (req, res) => {
  try {
    const { username } = req.query; // Use req.query for URL parameters

    // Check each model for a matching username
    const tourist = await TouristModel.findOne({ username: username });
    if (tourist) {
      return res.json({ username: tourist.username, role: "Tourist" });
    }

    const admin = await adminModel.findOne({ username: username });
    if (admin) {
      return res.json({ username: admin.username, role: "Admin" });
    }

    const seller = await SellerModel.findOne({ username: username });
    if (seller) {
      return res.json({ username: seller.username, role: "Seller" });
    }

    const tourismGoverner = await tourismGovernerModel.findOne({
      username: username,
    });
    if (tourismGoverner) {
      return res.json({
        username: tourismGoverner.username,
        role: "TourismGovernor",
      });
    }

    const advertiser = await AdvertiserModel.findOne({ username: username });
    if (advertiser) {
      return res.json({ username: advertiser.username, role: "Advertiser" });
    }

    const tourGuide = await TourGuideModel.findOne({ username: username });
    if (tourGuide) {
      return res.json({ username: tourGuide.username, role: "Tourguide" });
    }

    // If no user was found in any model, return a not found message
    res.status(404).json({ message: "No username found" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.put("/users/:username/wallet", async (req, res) => {
  try {
    const { refundAmount } = req.body;
    const { username } = req.params;

    const user = await TouristModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    user.wallet += refundAmount;
    await user.save();

    res
      .status(200)
      .json({ message: "Wallet updated successfully.", wallet: user.wallet });
  } catch (error) {
    console.error("Error updating wallet:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.put("/users/:username/cancelActivity/:activityId", async (req, res) => {
  try {
    const { username, activityId } = req.params;

    // Find the tourist and remove the activity from their bookedActivities array
    const tourist = await TouristModel.findOneAndUpdate(
      { username },
      { $pull: { bookedActivities: activityId } }, // $pull removes the activityId from the array
      { new: true } // Return the updated document
    );

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found." });
    }

    res
      .status(200)
      .json({ message: "Activity removed from bookedActivities.", tourist });
  } catch (error) {
    console.error("Error updating tourist:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.put("/users/:username/cancelItinerary/:itineraryId", async (req, res) => {
  try {
    const { username, itineraryId } = req.params;

    const tourist = await TouristModel.findOneAndUpdate(
      { username },
      { $pull: { bookedItineraries: itineraryId } }, // Remove itineraryId from bookedItineraries
      { new: true }
    );

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found." });
    }

    res
      .status(200)
      .json({ message: "Itinerary removed from bookedItineraries.", tourist });
  } catch (error) {
    console.error("Error updating tourist:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.put("/users/:username/wallet", async (req, res) => {
  try {
    const { refundAmount } = req.body;
    const { username } = req.params;

    const user = await TouristModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    user.wallet += refundAmount;
    await user.save();

    res
      .status(200)
      .json({ message: "Wallet updated successfully.", wallet: user.wallet });
  } catch (error) {
    console.error("Error updating wallet:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.put("/activities/:id/openBookings", async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByIdAndUpdate(
      id,
      { bookingOpen: true },
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({ error: "Activity not found." });
    }

    const notificationPromises = activity.interestedUsers.map((user) =>
      sendEmail(
        user.email,
        `Bookings Open for ${activity.name}`,
        "Bookings are now open! Visit our site to book your activity."
      )
    );

    await Promise.all(notificationPromises);

    res.status(200).json({
      message: "Activity bookings opened and users notified.",
      activity,
    });
  } catch (error) {
    console.error("Error opening bookings for activity:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.put("/itineraries/:id/activate", async (req, res) => {
  try {
    const { id } = req.params;

    const itinerary = await ItineraryModel.findByIdAndUpdate(
      id,
      { active: true },
      { new: true }
    );

    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found." });
    }

    const notificationPromises = itinerary.interestedUsers.map((user) =>
      sendEmail(
        user.email,
        `Bookings Open for ${itinerary.Itinerary_Name}`,
        "Bookings are now open! Visit our site to book your itinerary."
      )
    );

    await Promise.all(notificationPromises);

    res
      .status(200)
      .json({ message: "Itinerary activated and users notified.", itinerary });
  } catch (error) {
    console.error("Error activating itinerary:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/activities/:id/notify", async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const activity = await ActivityModel.findByIdAndUpdate(
      id,
      { $addToSet: { interestedUsers: username } }, // Prevent duplicates
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({ error: "Activity not found." });
    }

    res
      .status(200)
      .json({ message: "User added to notification list.", activity });
  } catch (error) {
    console.error("Error adding to notification list:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/itineraries/:id/notify", async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    console.log(username);

    const itinerary = await ItineraryModel.findByIdAndUpdate(
      id,
      { $addToSet: { interestedUsers: username } }, // Prevent duplicates
      { new: true }
    );

    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found." });
    }

    res
      .status(200)
      .json({ message: "User added to notification list.", itinerary });
  } catch (error) {
    console.error("Error adding to notification list:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.put("/itineraries/:id/activate", async (req, res) => {
  try {
    const { id } = req.params;

    const itinerary = await ItineraryModel.findByIdAndUpdate(
      id,
      { active: true },
      { new: true }
    );

    if (!itinerary) {
      return res.status(404).json({ error: "Itinerary not found." });
    }

    // Notify all interested users
    const notificationPromises = itinerary.interestedUsers.map((user) =>
      sendEmail(
        user.email,
        `Bookings Open for ${itinerary.Itinerary_Name}`,
        "Bookings are now open! Visit our site to book your itinerary."
      )
    );

    await Promise.all(notificationPromises);

    res
      .status(200)
      .json({ message: "Itinerary activated and users notified.", itinerary });
  } catch (error) {
    console.error("Error activating itinerary:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

//////////////////////////////// Seif & H 3 //////////////////////////////////////

app.get("/tourists/wishlist/:id", async (req, res) => {
  const touristId = req.params.id;

  try {
    const tourist = await TouristModel.findById(touristId).populate("wishlist");

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    return res.status(200).json({ wishlist: tourist.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Adding a product to the wishlist
app.put("/tourists/addProductToWishlist/:id", async (req, res) => {
  try {
    const touristId = req.params.id; // ID of the tourist
    const productId = req.body.productId; // ID of the product to be added

    // Ensure productId is provided
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find the tourist by ID
    const tourist = await TouristModel.findById(touristId);

    const wishlistIds = tourist.wishlist.map((item) => String(item));

    console.log(wishlistIds.includes(String(productId)));
    // Check if product is already in wishlist
    if (wishlistIds.includes(String(productId))) {
      return res
        .status(400)
        .json({ message: "Product is already in the wishlist" });
    }

    // Add the product to the wishlist
    tourist.wishlist.push(productId);

    // Save the updated tourist document
    await tourist.save();

    // Populate the wishlist to return detailed product information
    const updatedTourist = await TouristModel.findById(touristId).populate(
      "wishlist"
    );

    res.status(200).json({
      message: "Product added to wishlist successfully",
      wishlist: updatedTourist.wishlist, // Populated wishlist
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.delete("/tourists/removeFromWishlist/:id", async (req, res) => {
  try {
    const touristId = req.params.id; // ID of the tourist
    const productId = req.body.productId; // ID of the product to be removed

    // Ensure productId is provided
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find the tourist by ID
    const tourist = await TouristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Check if the product exists in the wishlist
    const productIndex = tourist.wishlist.indexOf(productId);
    if (productIndex === -1) {
      return res.status(400).json({ message: "Product not found in wishlist" });
    }

    // Remove the product from the wishlist
    tourist.wishlist.splice(productIndex, 1);

    // Save the updated tourist document
    await tourist.save();

    // Populate the wishlist to return updated product details
    const updatedTourist = await TouristModel.findById(touristId).populate(
      "wishlist"
    );

    res.status(200).json({
      message: "Product removed from wishlist successfully",
      wishList: updatedTourist.wishlist, // Populated updated wishlist
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/tourists/cart/:id", async (req, res) => {
  const touristId = req.params.id;
  try {
    const tourist = await TouristModel.findById(touristId).populate(
      "cart.product"
    );

    if (!tourist) {
      return res.status(404).json({ error: "Tourist not found" });
    }

    return res.status(200).json({ cart: tourist.cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.put("/tourists/addToCart/:id", async (req, res) => {
  try {
    const touristId = req.params.id; // ID of the tourist
    const productId = req.body.productId; // ID of the product to be added
    const quantity = req.body.quantity; // Quantity to add

    // Ensure productId is provided
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.Quantity) {
      return res.status(400).json({ message: "Not enough products in stock" });
    }

    // Find the tourist by ID
    const tourist = await TouristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    const cartItemIndex = tourist.cart.findIndex(
      (item) => item.product._id.toString() === productId // Access the _id field of the product
    );

    console.log(cartItemIndex);

    if (cartItemIndex > -1) {
      // If product is already in the cart, update the quantity
      const currentQuantity = tourist.cart[cartItemIndex].quantity;

      if (currentQuantity + quantity > product.Quantity) {
        return res
          .status(400)
          .json({ message: "Not enough products in stock" });
      }

      tourist.cart[cartItemIndex].quantity += quantity;
    } else {
      // If product is not in the cart, add it
      tourist.cart.push({ product: productId, quantity });
    }

    // Save the updated tourist document
    await tourist.save();

    // Populate cart details for the response
    const updatedTourist = await TouristModel.findById(touristId).populate(
      "cart.product"
    );

    res.status(200).json({
      message: "Product added to cart successfully",
      cart: updatedTourist.cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/tourists/removeFromCart/:id", async (req, res) => {
  try {
    const touristId = req.params.id; // ID of the tourist
    const productId = req.body.productId; // ID of the product to be removed

    // Ensure productId is provided
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find the tourist by ID
    const tourist = await TouristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Check if the product exists in the wishlist
    const productIndex = tourist.cart.findIndex(
      (item) => item.product._id.toString() === productId // Access the _id field of the product
    );

    if (productIndex === -1) {
      return res.status(400).json({ message: "Product not found in cart" });
    }

    // Remove the product from the wishlist
    tourist.cart.splice(productIndex, 1);

    // Save the updated tourist document
    await tourist.save();

    // Populate the wishlist to return updated product details
    const updatedTourist = await TouristModel.findById(touristId).populate(
      "cart.product"
    );

    res.status(200).json({
      message: "Product removed from cart successfully",
      cart: updatedTourist.cart, // Populated updated cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/tourists/addToCartFromWishlist/:id", async (req, res) => {
  try {
    const touristId = req.params.id; // ID of the tourist
    const productId = req.body.productId; // ID of the product to move to the cart
    const quantity = req.body.quantity || 1; // Quantity to move (default is 1)

    // Ensure productId is provided
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find the tourist by ID
    const tourist = await TouristModel.findById(touristId);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the product in the wishlist

    const wishlistIndex = tourist.wishlist.findIndex(
      (item) => item.toString() === productId // Access the _id field of the product
    );

    console.log(wishlistIndex);

    if (wishlistIndex === -1) {
      return res.status(400).json({ message: "Product not found in wishlist" });
    }

    // Remove the product from the wishlist
    const [wishlistItem] = tourist.wishlist.splice(wishlistIndex, 1);

    // Add the product to the cart
    const cartIndex = tourist.cart.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (cartIndex === -1) {
      // Add the product if it doesn't exist in the cart
      tourist.cart.push({
        product: productId,
        quantity: wishlistItem.quantity || quantity,
      });
    } else {
      // Update the quantity if the product already exists in the cart
      tourist.cart[cartIndex].quantity += wishlistItem.quantity || quantity;
    }

    // Save the updated tourist document
    await tourist.save();

    // Populate both wishlist and cart to return updated details
    const updatedTourist = await TouristModel.findById(touristId)
      .populate("wishlist")
      .populate("cart.product");

    res.status(200).json({
      message: "Product moved to cart successfully",
      wishList: updatedTourist.wishlist,
      cart: updatedTourist.cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/tourists/changeAmountInCart/:id", async (req, res) => {
  try {
    const touristId = req.params.id; // ID of the tourist
    const productId = req.body.productId; // ID of the product
    const quantity = req.body.quantity; // New quantity

    // Validate input
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    // Find the product to validate availability
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.Quantity) {
      return res.status(400).json({ message: "Not enough products in stock" });
    }

    // Find the tourist
    const tourist = await TouristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Find the product in the tourist's cart
    const cartIndex = tourist.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartIndex === -1) {
      return res.status(400).json({ message: "Product not found in cart" });
    }

    // Update the quantity or remove the product if quantity is 0
    if (quantity === 0) {
      tourist.cart.splice(cartIndex, 1); // Remove product from cart
    } else {
      tourist.cart[cartIndex].quantity = quantity; // Update quantity
    }

    // Save the updated tourist document
    await tourist.save();

    // Populate the cart to return updated details
    const updatedTourist = await TouristModel.findById(touristId).populate(
      "cart.product"
    );

    res.status(200).json({
      message: "Cart updated successfully",
      cart: updatedTourist.cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT endpoint to add a flight to bookedFlights array
app.put("/addFlight", async (req, res) => {
  console.log("in");
  try {
    const username = req.body.username; // Username passed in the request body
    const tourist = await TouristModel.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }
    const isEligible = tourist.canBook();
    if (!isEligible) {
      return res
        .status(404)
        .json({ message: "Tourist is less than 18 years old" });
    }
    const flightDetails = req.body.flightDetails; // Flight details object
    console.log(req.body);
    // Update the bookedFlights array by pushing new flight details
    const updatedTouristWithBooking = await TouristModel.findOneAndUpdate(
      { username: username }, // Find the tourist by username
      { $push: { bookedFlights: flightDetails } }, // Push to bookedFlights array
      { new: true } // Return the updated document
    );
    console.log(updatedTouristWithBooking);

    if (!updatedTouristWithBooking) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json({
      message: "Flight booked successfully",
      tourist: updatedTouristWithBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// PUT endpoint to add a hotel to bookedHotels array
app.put("/addHotel", async (req, res) => {
  console.log("in");
  try {
    const username = req.body.username; // Username passed in the request body
    const tourist = await TouristModel.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }
    const isEligible = tourist.canBook();
    if (!isEligible) {
      return res
        .status(404)
        .json({ message: "Tourist is less than 18 years old" });
    }
    const hotelDetails = req.body.hotelDetails; // Flight details object
    console.log(req.body);
    // Update the bookedFlights array by pushing new flight details
    const updatedTouristWithBooking = await TouristModel.findOneAndUpdate(
      { username: username }, // Find the tourist by username
      { $push: { bookedHotels: hotelDetails } }, // Push to bookedFlights array
      { new: true } // Return the updated document
    );
    console.log(updatedTouristWithBooking);

    if (!updatedTouristWithBooking) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json({
      message: "Hotel Booked Successfully",
      tourist: updatedTouristWithBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// PUT endpoint to add a flight to bookedFlights array
app.put("/addFlightWithWallet", async (req, res) => {
  console.log("in");
  try {
    const username = req.body.username; // Username passed in the request body
    const flightDetails = req.body.flightDetails;
    const tourist = await TouristModel.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }
    const isEligible = tourist.canBook();
    if (!isEligible) {
      return res
        .status(404)
        .json({ message: "Tourist is less than 18 years old" });
    }
    if (tourist.wallet < flightDetails.totalPrice) {
      return res.status(500).json({ message: "not enough funds in wallet" });
    }
    // Update the bookedFlights array by pushing new flight details
    const updatedTouristWithBooking = await TouristModel.findOneAndUpdate(
      { username: username }, // Find the tourist by username
      { $push: { bookedFlights: flightDetails } }, // Push to bookedFlights array
      { new: true } // Return the updated document
    );
    if (!updatedTouristWithBooking) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    tourist.wallet -= flightDetails.totalPrice;
    await tourist.save();

    res.status(200).json({
      message: "Flight booked successfully",
      tourist: updatedTouristWithBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.put("/addFlightWithCard", async (req, res) => {
  console.log("inFlightWithCard");
  try {
    const username = req.body.username; // Username passed in the request body
    const flightDetails = req.body.flightDetails;
    console.log(req.body);
    console.log(flightDetails);
    const tourist = await TouristModel.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }
    const isEligible = tourist.canBook();
    if (!isEligible) {
      return res
        .status(404)
        .json({ message: "Tourist is less than 18 years old" });
    }
    // Update the bookedFlights array by pushing new flight details
    const updatedTouristWithBooking = await TouristModel.findOneAndUpdate(
      { username: username }, // Find the tourist by username
      { $push: { bookedFlights: flightDetails } }, // Push to bookedFlights array
      { new: true } // Return the updated document
    );
    if (!updatedTouristWithBooking) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    res.status(200).json({
      message: "Flight booked successfully",
      tourist: updatedTouristWithBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// PUT endpoint to add a hotel to bookedHotels array
app.put("/addHotelWithCard", async (req, res) => {
  try {
    const username = req.body.username; // Username passed in the request body
    const hotelDetails = req.body.hotelDetails;
    const tourist = await TouristModel.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }
    const isEligible = tourist.canBook();
    if (!isEligible) {
      return res
        .status(404)
        .json({ message: "Tourist is less than 18 years old" });
    }
    // Update the bookedFlights array by pushing new flight details
    const updatedTouristWithBooking = await TouristModel.findOneAndUpdate(
      { username: username }, // Find the tourist by username
      { $push: { bookedHotels: hotelDetails } }, // Push to bookedFlights array
      { new: true } // Return the updated document
    );
    if (!updatedTouristWithBooking) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    res.status(200).json({
      message: "Hotel booked successfully",
      tourist: updatedTouristWithBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.put("/addHotelWithWallet", async (req, res) => {
  console.log("in");
  try {
    const username = req.body.username; // Username passed in the request body
    const hotelDetails = req.body.hotelDetails; // Flight details object
    const tourist = await TouristModel.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }
    const isEligible = tourist.canBook();
    if (!isEligible) {
      return res
        .status(404)
        .json({ message: "Tourist is less than 18 years old" });
    }
    if (tourist.wallet < hotelDetails.totalPrice) {
      return res.status(500).json({ message: "not enough funds in wallet" });
    }
    // Update the bookedFlights array by pushing new flight details
    const updatedTouristWithBooking = await TouristModel.findOneAndUpdate(
      { username: username }, // Find the tourist by username
      { $push: { bookedHotels: hotelDetails } }, // Push to bookedFlights array
      { new: true } // Return the updated document
    );
    console.log(updatedTouristWithBooking);

    if (!updatedTouristWithBooking) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    tourist.wallet -= hotelDetails.totalPrice;
    await tourist.save();
    res.status(200).json({
      message: "Hotel Booked Successfully",
      tourist: updatedTouristWithBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.put("/addTransportWithWallet", async (req, res) => {
  try {
    const username = req.body.username; // Username passed in the request body
    const transportationDetails = req.body.transportationDetails;
    const tourist = await TouristModel.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }
    const isEligible = tourist.canBook();
    if (!isEligible) {
      return res
        .status(404)
        .json({ message: "Tourist is less than 18 years old" });
    }
    if (tourist.wallet < transportationDetails.price) {
      return res.status(500).json({ message: "not enough funds in wallet" });
    }
    const updatedTouristWithBooking = await TouristModel.findOneAndUpdate(
      { username: username }, // Find the tourist by username
      { $push: { bookedTransportations: transportationDetails } },
      { new: true } // Return the updated document
    );
    tourist.wallet -= transportationDetails.price;
    await tourist.save();

    if (!updatedTouristWithBooking) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    res.status(200).json({
      message: "Transportation Booked Successfully",
      tourist: updatedTouristWithBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.post("/addTransportWithCard", async (req, res) => {
  try {
    const { transportationDetails, username } = req.body;
    const tourist = await TouristModel.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }
    const isEligible = tourist.canBook();
    if (!isEligible) {
      return res
        .status(404)
        .json({ message: "Tourist is less than 18 years old" });
    }
    const updatedTouristWithBooking = await TouristModel.findOneAndUpdate(
      { username: username }, // Find the tourist by username
      { $push: { bookedTransportations: transportationDetails } },
      { new: true } // Return the updated document
    );
    console.log(updatedTouristWithBooking);

    if (!updatedTouristWithBooking) {
      return res.status(404).json({ message: "Tourist not found" });
    } else {
      return res.status(200).json({ message: "success :.}" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});
app.post("/validatePromoCode", async (req, res) => {
  try {
    console.log(req.body);
    const { promoCode, username } = req.body;

    // Ensure both promoCode and username are provided
    if (!promoCode || !username) {
      return res
        .status(400)
        .json({ message: "Promo code and username are required." });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    // Find the promo code
    const promo = await PromoCode.findOne({ code: promoCode });
    if (!promo) {
      return res.status(404).json({ message: "Promo code not found." });
    }

    // Check if promo code is active
    if (!promo.isActive) {
      return res.status(400).json({ message: "Promo code is inactive." });
    }

    // Check if promo code has expired
    if (new Date() > promo.expiryDate) {
      return res.status(400).json({ message: "Promo code has expired." });
    }

    // Check if timesUsed exceeds usageLimit
    if (promo.timesUsed >= promo.usageLimit) {
      return res
        .status(400)
        .json({ message: "Promo code usage limit reached." });
    }

    // Check if the promo code is tied to the tourist (only if touristId exists)
    if (
      promo.touristId &&
      promo.touristId.toString() !== tourist._id.toString()
    ) {
      return res
        .status(400)
        .json({ message: "Promo code is not valid for this user." });
    }

    // All checks passed, return the discount
    console.log(promo.discount);
    console.log("mho da5l validate aho");
    return res.status(200).json({ discount: promo.discount });
  } catch (error) {
    console.error("Error validating promo code:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});
app.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log("Request Body:", req.body);
    console.log("Received email:", email);

    // Input validation
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required." });
    }

    // List of user models to check
    const userModels = [
      TouristModel,
      TourGuideModel,
      AdvertiserModel,
      tourismGovernerModel,
      SellerModel,
      adminModel,
    ];

    let userFound = false;

    // Iterate through all user models to find and update the user
    for (const model of userModels) {
      const user = await model.findOne({ email });
      if (user) {
        // Handle different casing for the password field
        if (
          model.modelName === "Admin" ||
          model.modelName === "TourismGoverner"
        ) {
          user.Password = newPassword; // Capital 'P' for Admin and TourismGoverner
        } else {
          user.password = newPassword; // Lowercase 'p' for other models
        }

        // Save the updated user
        await user.save();

        console.log(
          `Password reset successfully for ${email} in model ${model.modelName}`
        );
        userFound = true;
        return res
          .status(200)
          .json({ success: true, message: "Password reset successfully." });
      }
    }

    if (!userFound) {
      console.log("User not found:", email);
      return res.status(404).json({ message: "User not found in any model." });
    }
  } catch (err) {
    console.error("Error occurred while resetting password:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

app.get("/admin/sales-report", async (req, res) => {
  try {
    // Fetch purchased products
    const tourists = await TouristModel.find().populate(
      "purchasedItems.product"
    ); // Populate purchased items with product details

    const purchasedProducts = tourists.flatMap((tourist) =>
      tourist.purchasedItems.map((item) => ({
        name: item.product?.Name || "Unknown Product",
        price: item.product?.Price || 0,
        quantity: item.quantity || 0,
        date: item.product?.date || 0, // Convert to ISO string        total: ((item.product?.Price || 0) * 0.1).toFixed(2),
        appCommission: ((item.product?.Price || 0) * 0.1).toFixed(2), // 10% commission
      }))
    );

    // Calculate total commission for products
    const productCommissionTotal = purchasedProducts.reduce(
      (total, item) => total + parseFloat(item.appCommission),
      0
    );

    // Fetch all booked itineraries
    const bookedItineraries = await ItineraryModel.find({ booked: true });

    const itineraryDetails = bookedItineraries.map((itinerary) => ({
      name: itinerary.Itinerary_Name,
      price: itinerary.price,
      date: itinerary.date_time || "Unknown Date", // Assuming a `date_time` field exists
      appCommission: (itinerary.price * 0.1).toFixed(2),
    }));

    const itineraryCommissionTotal = itineraryDetails.reduce(
      (total, item) => total + parseFloat(item.appCommission),
      0
    );

    // Fetch all booked activities
    const bookedActivities = await Activity.find({
      bookingOpen: false,
      bookedBy: { $exists: true },
    });

    const activityDetails = bookedActivities.map((activity) => ({
      name: activity.name,
      price: activity.price,
      date: activity.date || "Unknown Date", // Assuming a `date` field exists
      appCommission: (activity.price * 0.1).toFixed(2),
    }));

    const activityCommissionTotal = activityDetails.reduce(
      (total, item) => total + parseFloat(item.appCommission),
      0
    );

    // Calculate total revenue
    const totalCommission =
      itineraryCommissionTotal +
      activityCommissionTotal +
      productCommissionTotal;

    // Respond with JSON
    res.status(200).json({
      message: "Sales report generated successfully.",
      totalCommission: totalCommission.toFixed(2),
      details: {
        itineraries: {
          count: itineraryDetails.length,
          commissionDetails: itineraryDetails,
          totalCommission: itineraryCommissionTotal.toFixed(2),
        },
        activities: {
          count: activityDetails.length,
          commissionDetails: activityDetails,
          totalCommission: activityCommissionTotal.toFixed(2),
        },
        products: {
          count: purchasedProducts.length,
          commissionDetails: purchasedProducts,
          totalCommission: productCommissionTotal.toFixed(2),
        },
      },
    });
  } catch (error) {
    console.error("Error generating sales report:", error.message);
    res.status(500).json({
      message: `Error: ${error.message || "Failed to generate sales report."}`,
    });
  }
});

app.get("/sales-reportS", async (req, res) => {
  try {
    const { sellerUsername } = req.query;
    console.log("Seller Username from Query:", sellerUsername);

    if (!sellerUsername) {
      return res.status(400).json({ message: "Seller username is required." });
    }

    // Find all tourists who have purchased items
    const tourists = await TouristModel.find({
      "purchasedItems.product": { $exists: true },
    })
      .populate("purchasedItems.product")
      .exec();

    if (!tourists.length) {
      return res
        .status(404)
        .json({ message: "No tourists found with purchased items." });
    }

    tourists.forEach((tourist, idx) => {
      console.log(
        `Tourist ${idx + 1}:`,
        JSON.stringify(tourist.purchasedItems, null, 2)
      );
    });

    // Process purchased products and filter by sellerUsername
    const purchasedProducts = tourists.flatMap((tourist) =>
      tourist.purchasedItems
        .filter((item) => item.product?.sellerUsername === sellerUsername)
        .map((item) => {
          // Get the product date and format it
          const productDate = new Date(item.product?.createdAt);
          const validDate = !isNaN(productDate.getTime()) ? productDate : null;

          // Return product data, formatting the date if valid
          return {
            name: item.product?.Name || "Unknown Product",
            price: item.product?.Price || 0,
            quantity: item.quantity || 0,
            date: item.product?.date || 0, // Format the date as a readable string
            totalRevenue: (item.product?.Price || 0) * item.quantity,
          };
        })
    );

    if (purchasedProducts.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found matching the criteria." });
    }

    // Calculate total revenue
    const totalRevenue = purchasedProducts.reduce(
      (total, item) => total + item.totalRevenue,
      0
    );

    res.status(200).json({
      message: "Sales report generated successfully.",
      totalRevenue: totalRevenue.toFixed(2),
      products: purchasedProducts,
    });
  } catch (error) {
    console.error("Error generating sales report:", error);
    res.status(500).json({ message: `Error: ${error.message}` });
  }
});

app.get("/sales-report/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Verify the tour guide exists
    const tourGuide = await TourGuideModel.findOne({
      username: username.trim(),
    });
    if (!tourGuide) {
      return res.status(404).json({ message: "Tour guide not found." });
    }

    // Fetch itineraries for the tour guide
    const itineraries = await ItineraryModel.find({ tourGuideName: username });

    // Process itinerary details
    const itineraryDetails = await Promise.all(
      itineraries.map(async (itinerary) => {
        // Use the activity array from the itinerary
        const activityDetails = await Promise.all(
          itinerary.activity.map(async (activityItem) => {
            const activity = await ActivityModel.findOne({
              name: activityItem.name,
            });
            return {
              name: activityItem.name,
              time: activityItem.time,
              price: activity ? activity.price : 0,
              bookings: activity ? activity.bookedBy.length : 0,
              date: activity ? activity.date : itinerary.date_time,
              month: new Date(
                activity ? activity.date : itinerary.date_time
              ).toLocaleString("default", {
                month: "long",
              }),
              totalRevenue: activity
                ? (activity.price * activity.bookedBy.length * 0.1).toFixed(2)
                : "0.00", // 10% commission
            };
          })
        );

        return {
          Itinerary_Name: itinerary.Itinerary_Name,
          tourGuideName: itinerary.tourGuideName,
          date: itinerary.date_time,
          month: new Date(itinerary.date_time).toLocaleString("default", {
            month: "long",
          }),
          price: itinerary.price,
          commission: (itinerary.price * 0.1).toFixed(2), // 10% commission for the itinerary
          activities: activityDetails,
        };
      })
    );

    // Calculate total revenues
    const totalItineraryRevenue = itineraryDetails.reduce(
      (total, item) => total + parseFloat(item.commission),
      0
    );
    const totalActivityRevenue = itineraryDetails.reduce(
      (total, item) =>
        total +
        item.activities.reduce(
          (activityTotal, activity) =>
            activityTotal + parseFloat(activity.totalRevenue),
          0
        ),
      0
    );

    const totalRevenue = totalItineraryRevenue + totalActivityRevenue;

    // Return the sales report
    res.status(200).json({
      username: tourGuide.username,
      totalItineraryRevenue: totalItineraryRevenue.toFixed(2),
      totalActivityRevenue: totalActivityRevenue.toFixed(2),
      totalRevenue: totalRevenue.toFixed(2),
      itineraries: itineraryDetails,
      message: `Sales report for ${tourGuide.username}`,
    });
  } catch (error) {
    console.error("Error fetching sales report:", error.message);
    res.status(500).json({ message: "Failed to fetch sales report." });
  }
});

app.get("/advertiser-sales-report/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Verify the advertiser exists
    const advertiser = await AdvertiserModel.findOne({
      username: username.trim(),
    });
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found." });
    }

    // Fetch activities and calculate revenue (only 10% of total revenue)
    const activities = await Activity.find({
      advertiserUsername: username,
      bookedBy: { $exists: true, $not: { $size: 0 } },
    });

    const activityDetails = activities.map((activity) => {
      const totalBookings = activity.bookedBy.length;
      const totalRevenue = (activity.price * 0.1).toFixed(2); // 10% of the total revenue

      return {
        name: activity.name,
        price: activity.price,
        bookings: totalBookings,
        date: activity.date.toISOString(), // Ensure the date is in ISO format
        totalRevenue, // 10% revenue per activity
      };
    });

    // Calculate total revenue from all activities (sum of all 10% revenues)
    const totalActivityRevenue = activityDetails.reduce(
      (total, item) => total + parseFloat(item.totalRevenue),
      0
    );

    // Return the sales report
    res.status(200).json({
      username: advertiser.username,
      totalActivityRevenue: totalActivityRevenue.toFixed(2), // Total revenue rounded to 2 decimal places
      activities: activityDetails,
      message: `Sales report for advertiser ${advertiser.username}`,
    });
  } catch (error) {
    console.error("Error fetching sales report:", error.message);
    res.status(500).json({ message: "Failed to fetch sales report." });
  }
});

app.get("/advertiser-tourist-report/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Verify the advertiser exists
    const advertiser = await AdvertiserModel.findOne({
      username: username.trim(),
    });
    if (!advertiser) {
      return res.status(404).json({ message: "Advertiser not found." });
    }

    // Fetch activities associated with the advertiser
    const activities = await Activity.find({
      advertiserUsername: username,
      bookedBy: { $exists: true, $not: { $size: 0 } },
    });

    const activityDetails = activities.map((activity) => ({
      name: activity.name,
      date: activity.date.toISOString(),
      totalTourists: activity.bookedBy.length, // Count of tourists for this activity
    }));

    res.status(200).json({
      username: advertiser.username,
      activities: activityDetails,
      message: `Tourist report for advertiser ${advertiser.username}`,
    });
  } catch (error) {
    console.error("Error fetching tourist report:", error.message);
    res.status(500).json({ message: "Failed to fetch tourist report." });
  }
});

app.get("/tour-guide-report/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Fetch itineraries associated with the tour guide
    const itineraries = await ItineraryModel.find({
      tourGuideName: username.trim(),
      bookedBy: { $exists: true, $not: { $size: 0 } },
    });

    // Extract activity names from itineraries
    const activityNames = itineraries.flatMap((itinerary) =>
      itinerary.activity.map((act) => act.name)
    );

    // Fetch all activities using the extracted names
    const activitiesFromItineraries = await Activity.find({
      name: { $in: activityNames },
    });

    // Create a map of activity details by name
    const activityMap = activitiesFromItineraries.reduce((map, activity) => {
      map[activity.name] = {
        name: activity.name,
        date: activity.date,
        totalTourists: activity.bookedBy.length,
        totalRevenue: activity.totalRevenue,
      };
      return map;
    }, {});

    // Process itineraries and attach the corresponding activities
    const itineraryDetails = itineraries.map((itinerary) => {
      const activities = itinerary.activity
        .map((act) => activityMap[act.name] || null)
        .filter(Boolean);

      return {
        name: itinerary.Itinerary_Name,
        date: itinerary.date_time.toISOString(),
        totalTourists: itinerary.bookedBy.length,
        activities,
        totalActivityTourists: activities.reduce(
          (sum, act) => sum + act.totalTourists,
          0
        ),
      };
    });

    // Calculate the overall total tourists and return the response
    const totalTourists = itineraryDetails.reduce(
      (sum, itinerary) => sum + itinerary.totalTourists,
      0
    );

    res.status(200).json({
      username,
      totalTourists,
      itineraries: itineraryDetails,
      message: `Tour Guide report for ${username}`,
    });
  } catch (error) {
    console.error("Error fetching tour guide report:", error.message);
    res.status(500).json({ message: "Failed to fetch tour guide report." });
  }
});

app.use("/api", otpRoutes);

// Route to create a promo code
app.post("/api/promo-code", promoCodeController.createPromoCode);

// Route to create a promo code
app.post("/api/promo-code", promoCodeController.createPromoCode);

app.post("/checkout-cart-with-card", async (req, res) => {
  console.log(req.body);
  try {
    const { username, lineItems, category, totalPrice, address } = req.body;

    if (!lineItems || lineItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }
    // Find the tourist by username
    const tourist = await TouristModel.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    // Prepare the order array with product IDs and quantities
    const order = await Promise.all(
      lineItems.map(async (item) => {
        const productName = item.price_data.product_data.name;

        // Find the product by name
        const product = await productModel.findOne({ Name: productName });
        if (!product) {
          throw new Error(`Product not found: ${productName}`);
        }

        return {
          product: product._id,
          quantity: item.quantity,
        };
      })
    );
    // Prepare the order array with product IDs and quantities
    let seller;
    const updatedQuantity = await Promise.all(
      lineItems.map(async (item) => {
        const productName = item.price_data.product_data.name;

        // Find the product by name
        const product = await productModel.findOne({ Name: productName });
        const newQuantity = product.Quantity - item.quantity;
        if (!product) {
          throw new Error(`Product not found: ${productName}`);
        }
        const updatedProduct = await productModel.findByIdAndUpdate(
          product._id,
          { Quantity: newQuantity }
        );
        if (newQuantity === 0) {
          try {
            seller = await SellerModel.findById(product.sellerId);
            await SellerModel.findByIdAndUpdate(seller._id, {
              $push: {
                notifications: {
                  message: `Stock Alert: ${product.Name} is out of stock`,
                },
              },
            });
            const transporter = nodemailer.createTransport({
              service: "gmail", // or your email provider
              auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
              },
            });

            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: seller.email, // Assuming `sellerEmail` is part of the Product model
              subject: `Stock Alert: ${product.Name} is out of stock`,
              text: `Dear ${seller.name}, \n\nThe product "${product.Name}" is now out of stock. Please restock it as soon as possible.\n\nRegards,\nYour Store Team`,
            };

            await transporter.sendMail(mailOptions);
            console.log("Stock alert email sent to seller.");
            const admins = await adminModel.find();
            const adminEmails = admins.map((admin) => admin.email);
            const mailOptionsForAdmins = {
              from: process.env.EMAIL_USER,
              to: adminEmails.join(","), // Join emails into a comma-separated string
              subject: `Admin Alert: Product "${product.Name}" is out of stock`,
              text: `Dear Admins,\n\nThe product "${product.Name}" is now out of stock. Please coordinate with the seller (${seller.name}, ${seller.email}) to restock it as soon as possible.\n\nRegards,\nYour Store Team`,
            };
            await transporter.sendMail(mailOptionsForAdmins);
            console.log("Emails sent to admins successfully.");
            const adminIds = admins.map((admin) => admin._id);
            for (let i = 0; i < adminIds.length; i++) {
              await adminModel.findByIdAndUpdate(adminIds[i], {
                $push: {
                  notifications: {
                    message: `Stock Alert: ${product.Name} is out of stock`,
                  },
                },
              });
            }
          } catch (emailError) {
            console.error(
              `Failed to send stock alert email to ${seller.email}: ${emailError.message}`
            );
            // Optional: Add additional error handling, such as notifying an admin or logging in an error-tracking system
          }
        }

        return {
          updatedProduct,
        };
      })
    );
    // Create the order object
    const newOrder = {
      order: order,
      totalPrice: totalPrice,
      date: new Date().toISOString(),
      address: address,
    };

    // Push the new order into the tourist's orders array
    tourist.orders.push(newOrder);
    tourist.cart = [];
    // Save the updated tourist document
    await tourist.save();
    try {
      const transporter2 = nodemailer.createTransport({
        service: "gmail", // or your email provider
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions2 = {
        from: process.env.EMAIL_USER,
        to: tourist.email, // Assuming `tourist.email` is valid
        subject: `Checkout Receipt`,
        text: `Dear ${tourist.name}, \n\nThank you for purchasing from trip saviour :). Total: ${totalPrice} USD.\n\nRegards,\nYour Store Team`,
      };

      await transporter2.sendMail(mailOptions2);
      console.log("Receipt alert email sent to tourist.");
    } catch (emailError) {
      console.error(
        `Failed to send receipt email to ${tourist.email}: ${emailError.message}`
      );
      // Log the error but do not interrupt the order processing flow
    }
    res
      .status(200)
      .json({ message: "Order successfully added.", order: newOrder });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
});
app.post("/checkout-cart-with-wallet", async (req, res) => {
  console.log(req.body);
  let totalPrice = 0;
  let updatedQuantity;
  let seller;
  let product;
  let admins;
  let adminIds;
  try {
    const { username, cart, discount, address } = req.body;
    // Validate input
    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }
    // 1. Find tourist
    const tourist = await TouristModel.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    for (let i = 0; i < cart.length; i++) {
      product = cart[i].product;
      totalPrice = product.Price * cart[i].quantity + totalPrice;
    }
    totalPrice = totalPrice * (1 - discount / 100);
    totalPrice += 5;

    if (tourist.wallet < totalPrice) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // 4. Update wallet only after successful transaction
    tourist.wallet -= totalPrice;
    await tourist.save();

    res.status(200).json({ message: "Payment successful" });

    for (let i = 0; i < cart.length; i++) {
      product = cart[i].product;
      updatedQuantity = product.Quantity - cart[i].quantity;
      if (updatedQuantity < 0) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.Name}.` });
      }
      await productModel.findByIdAndUpdate(
        product._id,
        { $set: { Quantity: updatedQuantity } },
        { new: true }
      );
      seller = await SellerModel.findById(product.sellerId);
      admins = await adminModel.find();
      if (updatedQuantity === 0) {
        //lw product quantity b2t 0 n3ml notify llseller wl admin
        await SellerModel.findByIdAndUpdate(seller._id, {
          $push: {
            notifications: {
              message: `Stock Alert: ${product.Name} is out of stock`,
            },
          },
        });
        const transporter = nodemailer.createTransport({
          service: "gmail", // or your email provider
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: seller.email, // Assuming `sellerEmail` is part of the Product model
          subject: `Stock Alert: ${product.Name} is out of stock`,
          text: `Dear ${seller.name}, \n\nThe product "${product.Name}" is now out of stock. Please restock it as soon as possible.\n\nRegards,\nYour Store Team`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Stock alert email sent to seller.");
        //notify admin by email
        const adminEmails = admins.map((admin) => admin.email);
        const mailOptionsForAdmins = {
          from: process.env.EMAIL_USER,
          to: adminEmails.join(","), // Join emails into a comma-separated string
          subject: `Admin Alert: Product "${product.Name}" is out of stock`,
          text: `Dear Admins,\n\nThe product "${product.Name}" is now out of stock. Please coordinate with the seller (${seller.name}, ${seller.email}) to restock it as soon as possible.\n\nRegards,\nYour Store Team`,
        };
        await transporter.sendMail(mailOptionsForAdmins);
        console.log("Emails sent to admins successfully.");
        //notify admin on system
        adminIds = admins.map((admin) => admin._id);
        for (let i = 0; i < adminIds.length; i++) {
          try {
            await adminModel.findByIdAndUpdate(adminIds[i], {
              $push: {
                notifications: {
                  message: `Stock Alert: ${product.Name} is out of stock`,
                },
              },
            });
          } catch (emailError) {
            console.error(
              `Failed to send stock alert email to ${seller.email}: ${emailError.message}`
            );
            // Optional: Add additional error handling, such as notifying an admin or logging in an error-tracking system
          }
        }
      }
    } // Create the order object
    const arrayOfProductIDs = cart.map((item) => {
      return {
        product: item.product._id,
        quantity: item.quantity,
      };
    });
    const randomDays = [3, 5, 7]; // Possible days
    const selectedDays =
      randomDays[Math.floor(Math.random() * randomDays.length)]; // Randomly choose one
    const today = new Date(); // Get today's date
    const ETA = new Date(today); // Create a new date object for the ETA
    ETA.setDate(today.getDate() + selectedDays); // Add the selected days to today's date

    const newOrder = {
      order: arrayOfProductIDs,
      totalPrice: totalPrice,
      date: new Date().toISOString(),
      ETA: ETA.toISOString(),
      address: address,
    };

    // Push the new order into the tourist's orders array
    tourist.orders.push(newOrder);
    tourist.wallet = tourist.wallet - totalPrice;
    tourist.cart = [];
    // Save the updated tourist document
    await tourist.save();
    try {
      const transporter2 = nodemailer.createTransport({
        service: "gmail", // or your email provider
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions2 = {
        from: process.env.EMAIL_USER,
        to: tourist.email, // Assuming `tourist.email` is valid
        subject: `Checkout Receipt`,
        text: `Dear ${tourist.name}, \n\nThank you for purchasing from trip saviour. Total: ${totalPrice} USD.\n\nRegards,\nYour Store Team`,
      };

      await transporter2.sendMail(mailOptions2);
      console.log("Receipt alert email sent to tourist.");
    } catch (emailError) {
      console.error(
        `Failed to send receipt email to ${tourist.email}: ${emailError.message}`
      );
      // Log the error but do not interrupt the order processing flow
    }
    res
      .status(200)
      .json({ message: "Order successfully added.", order: newOrder });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
});

app.delete("/admin/delete-notification", async (req, res) => {
  const { notificationId, username } = req.body;

  try {
    // Find the admin by username and remove the notification with the specified _id
    const updatedAdmin = await adminModel.findOneAndUpdate(
      { username },
      {
        $pull: {
          notifications: { _id: notificationId },
        },
      },
      { new: true } // Returns the updated document
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Notification removed successfully",
      updatedNotifications: updatedAdmin.notifications,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
});

app.get("/admin/get-notifications/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Find the admin by username
    const admin = await adminModel.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // Send the notifications array as a response
    return res.status(200).json({ notifications: admin.notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/seller/get-notifications/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Find the admin by username
    const seller = await SellerModel.findOne({ username });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found." });
    }

    // Send the notifications array as a response
    return res.status(200).json({ notifications: seller.notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

app.delete("/seller/delete-notification", async (req, res) => {
  const { notificationId, username } = req.body;

  try {
    // Find the admin by username and remove the notification with the specified _id
    const updatedSeller = await SellerModel.findOneAndUpdate(
      { username },
      {
        $pull: {
          notifications: { _id: notificationId },
        },
      },
      { new: true } // Returns the updated document
    );

    if (!updatedSeller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({
      message: "Notification removed successfully",
      updatedNotifications: updatedSeller.notifications,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
});

app.get("/tourist/get-notifications/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Find the admin by username
    const tourist = await TouristModel.findOne({ username });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found." });
    }

    // Send the notifications array as a response
    return res.status(200).json({ notifications: tourist.notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/create-checkout-session", async (req, res) => {
  console.log("fl checkout");
  console.log(req.body.products);
  const { products, category, currency, address } = req.body;
  let discount;
  if (req.body.discount) {
    discount = req.body.discount;
  } else {
    discount = 0;
  }
  let lineItems;
  let totalPrice = 0;
  console.log("ya rab");
  console.log(products);
  if (category === "cart") {
    for (let i = 0; i < products.length; i++) {
      totalPrice =
        products[i].product.Price * products[i].quantity + totalPrice;
    }
    console.log(products);
    lineItems = products.map((product) => ({
      price_data: {
        currency: currency, //7ot el currency el s7
        product_data: {
          name: product.product.Name,
          images: [product.product.image],
        },
        unit_amount: Math.round(
          product.product.Price * 100 * (1 - discount / 100)
        ),
      },
      quantity: product.quantity,
    }));
  } else {
    if (category === "activity") {
      console.log("fl act");
      console.log(products);
      lineItems = [
        {
          price_data: {
            currency: currency, //7ot el currency el s7
            product_data: { name: products.name, images: [products.image] },
            unit_amount: Math.round(
              products.price * 100 * (1 - discount / 100)
            ),
          },
          quantity: 1,
        },
      ];
      console.log(lineItems);
    }
    if (category === "itinerary") {
      lineItems = [
        {
          price_data: {
            currency: currency, //7ot el currency el s7
            product_data: {
              name: products.Itinerary_Name,
              images: [products.image],
            },
            unit_amount: Math.round(products.price * 100),
          },
          quantity: 1,
        },
      ];
      console.log(lineItems);
    }
    if (category === "transportation") {
      totalPrice = Math.round(products.price * 100);
      lineItems = [
        {
          price_data: {
            currency: currency, //7ot el currency el s7
            product_data: { name: products.name, images: [products.image] },
            unit_amount: Math.round(
              products.price * 100 * (1 - discount / 100)
            ),
          },
          quantity: 1,
        },
      ];
      console.log(lineItems);
    }
    if (category === "flight") {
      lineItems = [
        {
          price_data: {
            currency: currency, //7ot el currency el s7
            product_data: {
              name: `${products.origin}==>${products.destination} flight ticket`,
              images: [products.image],
            },
            unit_amount: Math.round(
              products.totalPrice * 100 * (1 - discount / 100)
            ),
          },
          quantity: 1,
        },
      ];
      console.log("fl checkout flights hsl tho");
    }
    if (category === "hotel") {
      lineItems = [
        {
          price_data: {
            currency: currency, //7ot el currency el s7
            product_data: {
              name: `booking in ${products.hotelName} from ${products.checkInDate} to ${products.checkOutDate}`,
              images: [products.image],
            },
            unit_amount: Math.round(
              products.totalPrice * 100 * (1 - discount / 100)
            ),
          },
          quantity: 1,
        },
      ];
      console.log(lineItems);
    }
  }
  if (
    category === "transportation" ||
    category === "flight" ||
    category === "hotel"
  ) {
    console.log("bismallah");
    console.log(products);
    console.log(req.body.products);
    const blabla = JSON.stringify({
      lineItems,
      category,
      totalPrice,
      products: products,
    });
    console.log(blabla);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:3000/successPage?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:3000/tourist-profile", //nfs lklam bs for cancel
      metadata: {
        data: JSON.stringify({ lineItems, category, totalPrice, products }), // Convert to string to store as metadata
      },
    });
    res.json({ id: session.id });
  } else {
    if (category === "cart") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `http://localhost:3000/successPage?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: "http://localhost:3000/tourist-profile", //nfs lklam bs for cancel
        metadata: {
          data: JSON.stringify({
            lineItems,
            category,
            totalPrice,
            address,
          }), // Convert to string to store as metadata
        },
      });
      res.json({ id: session.id });
    } else {
      console.log("line items");
      console.log(lineItems);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `http://localhost:3000/successPage?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: "http://localhost:3000/tourist-profile", //nfs lklam bs for cancel
        metadata: {
          data: JSON.stringify({ lineItems, category, totalPrice }), // Convert to string to store as metadata
        },
      });
      res.json({ id: session.id });
    }
  }
});
app.get("/retrieve-line-items", async (req, res) => {
  const { session_id } = req.query;

  try {
    console.log("fl retrieve ya wad");
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log(session);
    // Retrieve lineItems from metadata
    const data = JSON.parse(session.metadata.data);
    console.log(`bleez ${data}`);
    console.log(data);
    console.log("3ada");
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving session data", error });
  }
});

const calculateOrderStatus = (date) => {
  const today = new Date();
  const orderDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  orderDate.setHours(0, 0, 0, 0);

  // Compare the order date with today's date
  if (orderDate < today) {
    return "Arrived";
  }
  if (orderDate > today) {
    return "On the way";
  } else return "Processing";
};

app.get("/touristOrders/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get the tourist ID from the request parameters

    // Find the tourist by their ID
    const tourist = await Tourist.findById(id).populate("orders.order.product");

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Map the orders to include their calculated status
    const ordersWithStatus = tourist.orders.map((order) => ({
      ...order.toObject(),
      status: calculateOrderStatus(order.ETA), // Calculate the status dynamically
    }));

    // Respond with the tourist's orders including status
    res.status(200).json({ orders: ordersWithStatus });
  } catch (error) {
    console.error("Error fetching tourist orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
});
app.get("/touristCurrentOrders/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Get today's date as a string in the same format as ETA (assuming ISO string)
    const today = new Date().toISOString().split("T")[0];

    // Find the tourist by username
    const tourist = await Tourist.findOne({ username })
      .populate({
        path: "orders.order.product", // Populate product details
        model: "Product",
      })
      .select("orders")
      .exec();

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Filter the orders based on ETA
    const filteredOrders = tourist.orders.filter((order) => order.ETA >= today);

    filteredOrders.forEach((order) => {
      order.status = "On the way";
    });

    res.status(200).json(filteredOrders);
  } catch (error) {
    console.error("Error fetching current orders:", error);
    res.status(500).json({ message: "Error fetching current orders", error });
  }
});

app.get("/touristPastOrders/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Get today's date as a string in the same format as ETA (assuming ISO string)
    const today = new Date().toISOString().split("T")[0];

    // Find the tourist by username
    const tourist = await Tourist.findOne({ username })
      .populate({
        path: "orders.order.product", // Populate product details
        model: "Product",
      })
      .select("orders")
      .exec();

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Filter the orders based on ETA
    const filteredOrders = tourist.orders.filter((order) => order.ETA < today);

    filteredOrders.forEach((order) => {
      order.status = "Arrived";
    });

    res.status(200).json(filteredOrders);
  } catch (error) {
    console.error("Error fetching past orders:", error);
    res.status(500).json({ message: "Error fetching past orders", error });
  }
});

app.get("/touristOrderDetails/:username", async (req, res) => {
  try {
    const { username } = req.params; // Extract username from URL params
    const { orderId } = req.query; // Extract orderId from query params

    // Find the tourist by username and ensure the order exists in their orders array
    const tourist = await Tourist.findOne({
      username, // Match the tourist by their username
      "orders._id": orderId, // Ensure the order exists in their orders array
    })
      .populate({
        path: "orders.order.product", // Populate product details
        model: "Product",
      })
      .select("orders"); // Select only the orders field

    if (!tourist) {
      return res.status(404).json({ message: "Tourist or order not found" });
    }

    // Extract the specific order from the orders array
    const order = tourist.orders.find(
      (order) => order._id.toString() === orderId
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const today = new Date().toISOString().split("T")[0];
    if (order.ETA == today) {
      order.status = "processing";
    }
    if (order.ETA > today) {
      order.status = "On the way";
    } else {
      order.status = "Arrived";
    }

    // Respond with the order details
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Error fetching order details", error });
  }
});

app.put("/tourist/cancel-order", async (req, res) => {
  try {
    const { orderId, username } = req.body;

    // Find the tourist by username
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    // Find the order with the specified ID in the orders array
    const orderIndex = tourist.orders.findIndex(
      (o) => o._id.toString() === orderId
    );

    if (orderIndex === -1) {
      return res.status(404).json({ message: "Order not found." });
    }

    const order = tourist.orders[orderIndex];

    // Check if ETA is in the past
    const currentDateTime = new Date();
    const orderETA = new Date(order.ETA);

    if (orderETA <= currentDateTime) {
      return res.status(400).json({
        message: "Order cannot be cancelled as the ETA is in the past.",
      });
    }

    // Refund the total price to the tourist's wallet balance
    tourist.wallet += order.totalPrice;

    // Remove the order from the orders array
    tourist.orders.splice(orderIndex, 1);

    // Save the updated tourist document
    await tourist.save();

    res.status(200).json({
      message: "Order cancelled and refunded successfully.",
      walletBalance: tourist.wallet,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res
      .status(500)
      .json({ message: "An error occurred while cancelling the order." });
  }
});

app.put("/tourist/add-delivery-address", async (req, res) => {
  try {
    console.log(req.body);
    const { address, username } = req.body;

    if (!address || !username) {
      return res
        .status(400)
        .json({ message: "Address and username are required." });
    }

    // Normalize the input address (trim and convert to lowercase)
    const normalizedAddress = address.trim().toLowerCase();

    // Find the tourist by username
    const tourist = await Tourist.findOne({ username });
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    // Check if the normalized address already exists in deliveryAddresses
    const addressExists = tourist.deliveryAddresses.some(
      (existingAddress) =>
        existingAddress.trim().toLowerCase() === normalizedAddress
    );

    if (addressExists) {
      return res.status(400).json({ message: "Address already exists." });
    }

    // Add the new address to deliveryAddresses
    tourist.deliveryAddresses.push(address.trim());

    // Save the updated tourist document
    await tourist.save();

    res.status(200).json({
      message: "Address added successfully.",
      deliveryAddresses: tourist.deliveryAddresses,
    });
  } catch (err) {
    console.error("Error adding delivery address:", err);
    res
      .status(500)
      .json({ message: "An error occurred while adding the address." });
  }
});
app.put("/tourist/get-delivery-addresses", async (req, res) => {
  try {
    const { username } = req.body;

    // Validate input
    if (!username) {
      return res.status(400).json({ message: "Username is required." });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ username });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found." });
    }

    // Get delivery addresses (last 3 or empty array)
    const deliveryAddresses = tourist.deliveryAddresses || [];
    const lastThreeAddresses = deliveryAddresses.slice(-3);

    // Return the response
    return res.status(200).json({ deliveryAddresses: lastThreeAddresses });
  } catch (error) {
    console.error("Error fetching delivery addresses:", error);
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
});
// Route to accept terms and conditions
app.put("/accept-terms", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res
        .status(400)
        .json({ message: "Username and role are required." });
    }

    // Find the terms and conditions entry for the user
    let user = await SellerModel.findOne({ username });
    if (user) {
      user.termsAndConditions = true;
      await user.save();
      res.status(200).json({ message: "Terms accepted successfully." });
    } else {
      user = await TourGuideModel.findOne({ username });
      if (user) {
        user.termsAndConditions = true;
        await user.save();
        res.status(200).json({ message: "Terms accepted successfully." });
      } else {
        user = await AdvertiserModel.findOne({ username });
        if (user) {
          user.termsAndConditions = true;
          await user.save();
          res.status(200).json({ message: "Terms accepted successfully." });
        }
      }
    }

    // Also update the user's localStorage status
  } catch (err) {
    console.error("Error accepting terms:", err);
    res
      .status(500)
      .json({ message: "An error occurred while accepting the terms." });
  }
});

app.post("/tourist/updatePreferences", async (req, res) => {
  const { username, preferences, action } = req.body;

  try {
    // Ensure username is provided
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Ensure preferences is an array
    if (!Array.isArray(preferences)) {
      return res.status(400).json({ message: "Preferences must be an array" });
    }

    // Ensure action is either "add" or "remove"
    if (action !== "add" && action !== "remove") {
      return res
        .status(400)
        .json({ message: "Invalid action, must be 'add' or 'remove'" });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ username });

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Handle adding or removing preferences
    for (let pref of preferences) {
      if (action === "add") {
        // Only add the preference if it is not already in the array
        if (!tourist.touristprefrences.includes(pref)) {
          tourist.touristprefrences.push(pref);
        }
      } else if (action === "remove") {
        // Remove the preference if it exists
        tourist.touristprefrences = tourist.touristprefrences.filter(
          (item) => item !== pref
        );
      }
    }

    // Save the updated tourist document
    await tourist.save();

    return res.status(200).json({
      message: "Preferences updated successfully",
      prefrences: tourist.touristprefrences,
    });
  } catch (err) {
    console.error("Error updating preferences:", err);
    return res
      .status(500)
      .json({ message: "Server error while updating preferences" });
  }
});

app.get("/AllPreferences", async (req, res) => {
  try {
    // Fetch all preferences from the database
    const preferences = await PreferenceModel.find();

    // Send the preferences as the response
    res.status(200).json(preferences);
  } catch (err) {
    console.error("Error fetching preferences:", err);
    res
      .status(500)
      .json({ message: "Server error while retrieving preferences" });
  }
});

app.get("/tourist/getPreference", async (req, res) => {
  try {
    const { username } = req.query; // Get username from query parameters

    // Check if username is provided
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Find the tourist by username
    const tourist = await TouristModel.findOne({ username });

    // Check if the tourist exists
    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Send the preferences
    return res.status(200).json({ preferences: tourist.touristprefrences });
  } catch (err) {
    console.error("Error fetching preferences:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching preferences" });
  }
});

// Start the server
app.listen(3002, () => {
  console.log("Server is running on port 3002...");
});
