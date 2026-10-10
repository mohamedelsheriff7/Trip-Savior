const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Make sure to install bcrypt

// Import Models
//const adminModel = require('../models/Admin.js');
const preferenceModel = require('./models/Preference');
//const tourismGovernerModel = require('../Models/TourismGoverner.js');
//const categoryModel = require('../Models/Category.js');
const touristModel = require('./models/Tourist');
const itineraryModel = require('./models/Itinerary');
const productModel = require('./models/product');
const placeModel = require('./models/HistoricalPlace');
const activityModel = require('./models/Activity');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from your React app
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://nourhanmorad8:rz8REez3PEX4u5KD@cluster0.q2q36.mongodb.net/Trip_Saviour?retryWrites=true&w=majority")
    .then(() => console.log('MongoDB connected successfully')) 
    .catch(err => console.log('MongoDB connection error: ', err));

// Admin Endpoints
app.post('/admin/create', async (req, res) => {
    const { Username, Password } = req.body;

    try {
        const existingAdmin = await adminModel.findOne({ Username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newAdmin = new adminModel({ Username, Password });
        await newAdmin.save();
        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Preference Endpoints
app.post('/preference/create', async (req, res) => {
    try {
        const { Name } = req.body;
        const newPreference = new preferenceModel({ Name });
        await newPreference.save();
        res.status(201).json(newPreference);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/preference', async (req, res) => {
    try {
        const preferences = await preferenceModel.find();
        res.status(200).json(preferences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Preference Endpoint
app.put('/preference', async (req, res) => {
    try {
        const { Name, newName } = req.body; // Get current and new name from the body

        // Find and update the preference by name
        const updatedPreference = await preferenceModel.findOneAndUpdate(
            { Name }, // Find preference by current name
            { Name: newName }, // Update to new name
            { new: true, runValidators: true }
        );

        if (!updatedPreference) {
            return res.status(404).json({ message: 'Preference not found' });
        }
        res.status(200).json(updatedPreference);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Preference Endpoint
app.delete('/preference', async (req, res) => {
    try {
        const { Name } = req.body; // Get name from the body
        // Find and delete the preference by name
        const deletedPreference = await preferenceModel.findOneAndDelete({ Name });

        if (!deletedPreference) {
            return res.status(404).json({ message: 'Preference not found' });
        }
        res.status(200).json({ message: 'Preference deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Tourism Governer Endpoints
app.post('/tourism-governer/create', async (req, res) => {
    const { Username, Password } = req.body;

    try {
        const existingTourismGoverner = await tourismGovernerModel.findOne({ Username });
        if (existingTourismGoverner) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newTourismGoverner = new tourismGovernerModel({ Username, Password });
        await newTourismGoverner.save();
        res.status(201).json(newTourismGoverner);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Category Endpoints
app.post('/category/create', async (req, res) => {
    try {
        const { Name } = req.body;
        const newCategory = new categoryModel({ Name });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/category', async (req, res) => {
    try {
        const categories = await categoryModel.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/category/update', async (req, res) => {
    try {
        const { id, ...update } = req.body; // Destructure the ID and update object
        const updatedCategory = await categoryModel.findByIdAndUpdate(id, update, { new: true, runValidators: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/category/delete', async (req, res) => {
    try {
        const { id } = req.body; // Get ID from body
        const deletedCategory = await categoryModel.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.listen(3001, () => {
    console.log('Server working on port 3001...');
});