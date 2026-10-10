const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3001;


var cors = require("cors");
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from your React app


app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://nourhanmorad8:rz8REez3PEX4u5KD@cluster0.q2q36.mongodb.net/Trip_Saviour?retryWrites=true&w=majority")
    .then(() => console.log('MongoDB connected successfully')) 
    .catch(err => console.log('MongoDB connection error: ', err));


    const touristModel = require('./models/Tourist'); // Ensure this path is correct
   
const  itineraryModel  = require('./models/Itinerary'); 
const { productModel } = require('./models/product'); 
const placeModel = require('./models/HistoricalPlace'); // Correct path
const activityModel = require('./models/Activity'); // Correct path


const bcrypt = require('bcrypt'); // Make sure to install bcrypt

// GET /tourist/profile/:username - Retrieve tourist profile by username
app.get("/tourist/profile/:username", async (req, res) => {
    try {
        const { username } = req.params;
        console.log('Searching for username:', username);

        // Retrieve tourist by username without password check
        const tourist = await touristModel.findOne({ username });

        if (!tourist) {
            return res.status(404).json({ message: "Tourist not found" });
        }

        // Send the profile data (excluding the password)
        const { password, ...profileData } = tourist.toObject();  // Exclude the password
        res.status(200).json(profileData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving profile", error: err.message });
    }
});

app.get("/tourist", async (req, res) => {
    try {
        const tourists = await touristModel.find(); // Fetch all users
        res.status(200).json(tourists); // Return the list of tourists
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error retrieving tourists", error: err.message });
    }
});



// Assuming you have a login endpoint
// Assuming you're using Express
// POST route to login as a tourist


// Ensure you have middleware to parse JSON requests
app.use(express.json());

app.post("/tourist/login", async (req, res) => {
    const { username, email, password } = req.body; // Ensure username, email, and password are received

    try {
        // Find the tourist by username and email
        const tourist = await touristModel.findOne({ username, email });

        if (!tourist) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Validate the password
        const isPasswordValid = tourist.password === password; 

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Login success
        res.status(200).json({ message: "Login successful", tourist });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});



app.post("/tourist/profile", async (req, res) => {
    const { username, email, password, age, nationality, mobileNumber, work_status } = req.body;

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
    },);







    app.put('/tourist/profile/:username', async (req, res) => {
        const { username } = req.params;
        const { email, mobileNumber, nationality, work_status } = req.body; // Exclude wallet
    
        console.log('Updating profile for:', username); // Log username
        console.log('Request body:', req.body); // Log the request body
    
        try {
            const updatedTourist = await touristModel.findOneAndUpdate(
                { username },
                { email, mobileNumber, nationality, work_status }, // wallet is not included in the update
                { new: true, runValidators: true }
            );
    
            if (!updatedTourist) {
                return res.status(404).json({ message: "Tourist not found" });
            }
    
            // Return the updated tourist profile
            res.status(200).json({ message: "Profile updated successfully", tourist: updatedTourist });
        } catch (err) {
            console.error('Error updating profile:', err); // Log the error
            res.status(400).json({ message: "Error updating profile", error: err.message });
        }
    });
    
    




    app.get('/search', async (req, res) => {
        let { name, category, tag } = req.query;
    
        // Log the model definitions
       console.log('Place Model:', placeModel);
console.log('Activity Model:', activityModel);
    
        try {
            const searchResults = {
                historicalPlaces: [],
                activities: [],
                itineraries: []
            };
    
            // Searching by name
            if (name) {
                name = name.trim();
                searchResults.historicalPlaces = await placeModel.find({ name: { $regex: name, $options: 'i' } });
                searchResults.activities = await activityModel.find({ name: { $regex: name, $options: 'i' } });
                searchResults.itineraries = await itineraryModel.find({ Itinerary_Name: { $regex: name, $options: 'i' } });
            }
    
            // Searching by category
            if (category) {
                category = category.trim();
                searchResults.historicalPlaces = await placeModel.find({ category: { $regex: category, $options: 'i' } });
                searchResults.activities = await activityModel.find({ category: { $regex: category, $options: 'i' } });
                searchResults.itineraries = await itineraryModel.find({ preferences: { $regex: category, $options: 'i' } });
            }
    
            // Searching by tag
            if (tag) {
                tag = tag.trim();
                searchResults.historicalPlaces = await placeModel.find({ tags: { $regex: tag, $options: 'i' } });
                searchResults.activities = await activityModel.find({ tags: { $regex: tag, $options: 'i' } });
                searchResults.itineraries = await itineraryModel.find({ activities: { $regex: tag, $options: 'i' } });
            }
    
            res.status(200).json(searchResults);
        } catch (err) {
            res.status(500).json({ message: "Error searching", error: err.message });
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



app.listen(3002, () => {
    console.log('Server working on port 3002...');
});
