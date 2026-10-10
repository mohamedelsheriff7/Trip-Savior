const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb+srv://nourhanmorad8:rz8REez3PEX4u5KD@cluster0.q2q36.mongodb.net/Trip_Saviour?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error: ", err));

// Import the models
const { productModel } = require('./models/product'); 
const TouristModel = require("./models/Tourist.js");
const TourGuideModel = require("./models/Tourguide.js");
const AdvertiserModel = require("./models/Advertiser.js");
const SellerModel = require("./models/Seller.js");

// =============================== Tourist Registration ===============================

// Function to handle tourist creation
const createTourist = async (req, res) => {
  const { email, username, password, mobileNumber, nationality, date_of_birth, work_status } = req.body;
  try {
    const existingTourist = await TouristModel.findOne({ $or: [{ email }, { username }] });
    if (existingTourist) {
      return res.status(400).json({
        message: "Email or Username already in use, please choose a different one.",
      });
    }

    const tourist = await TouristModel.create({ email, username, password, mobileNumber, nationality, date_of_birth, work_status });
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
      return res.status(403).json({ message: "Tourists under 18 cannot book." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update tourist data except the DOB
const updateTourist = async (req, res) => {
  const { id } = req.params;
  const { email, username, password, mobileNumber, nationality, work_status } = req.body;

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

const registerTourGuide = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await TourGuideModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already in use." });
    }

    const newTourGuide = await TourGuideModel.create({ username, email, password });
    res.status(201).json({ message: "Tour guide registered successfully", data: newTourGuide });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

app.post("/registerTourGuide", registerTourGuide);

// =============================== Advertiser Registration ===============================

const registerAdvertiser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingAdvertiser = await AdvertiserModel.findOne({ $or: [{ email }, { username }] });
    if (existingAdvertiser) {
      return res.status(400).json({ error: "Username or email already in use" });
    }

    const newAdvertiser = await AdvertiserModel.create({ username, email, password });
    res.status(201).json({ message: "Advertiser registered successfully", data: newAdvertiser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

app.post("/registerAdvertiser", registerAdvertiser);

// =============================== Seller Registration ===============================

const registerSellerReg = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingSeller = await SellerModel.findOne({ $or: [{ email }, { username }] });
    if (existingSeller) {
      return res.status(400).json({ error: "Username or email already in use." });
    }

    const newSeller = await SellerModel.create({ username, email, password });
    res.status(201).json({ message: "Seller registered successfully", data: newSeller });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

app.post("/registerSellerReg", registerSellerReg);

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
  
        await existingSeller.save(); // Save the updated seller
        console.log("Seller profile updated:", existingSeller);
        return res.status(200).json(existingSeller);
      }
  
      // If no seller is found with the given username and email, return an error
      return res.status(404).json({ message: "User does not exist. Please check your credentials." });
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

        const existingSeller = await SellerModel.findOne({ username, email });

        if (existingSeller) {
            if (existingSeller.password !== password) {
                return res.status(401).json({ message: "Incorrect password." });
            }

            // Update fields if provided
            if (name !== undefined) existingSeller.name = name;
            if (description !== undefined) existingSeller.description = description;

            await existingSeller.save();
            console.log("Seller profile updated:", existingSeller);
            return res.status(200).json(existingSeller);
        }

        return res.status(404).json({ message: "Seller does not exist. Please check your credentials." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server is not working" });
    }
});
app.get('/products', async (req, res) => {
  try {
      const products = await productModel.find();

      if (!products || products.length === 0) {
          return res.status(404).json({ message: "No products found" });
      }

      res.status(200).json(products);
  } catch (err) {
      res.status(500).json({ message: "Error retrieving products", error: err.message });
  }
});




// Start the server
app.listen(3002, () => {
  console.log("Server working on port 3002...");
});
