// controllers/complaintController.js
const Complaint = require('../models/Complaint');

exports.fileComplaint = async (req, res) => {
    const { Title, Body, Date } = req.body;

    try {
        const complaint = new Complaint({
            Title,
            Body,
            Date,
            Status: "Pending" // Status defaults to "Pending" as defined in the schema
        });
        await complaint.save();
        res.status(201).json({ message: 'Complaint filled successfully', complaint });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error filling complaint', error: error.message });
    }
};
