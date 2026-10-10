const mongoose = require("mongoose");
const Bookmark = require("../models/Bookmark");
const Itinerary = require("../models/Itinerary");
const Activity = require("../models/Activity");


// Register models in Mongoose
mongoose.model("activities", Activity.schema);
mongoose.model("itinerary", Itinerary.schema);

// Add a bookmark
exports.addBookmark = async (req, res) => {
    try {

      console.log("Bookmark Request Body:", req.body); // Log the incoming request data

      const { touristId, eventId, type } = req.body;
  
      // Validate the type field
      if (!["itinerary", "activities"].includes(type)) {
        return res.status(400).json({ message: "Invalid type provided. Must be 'itinerary' or 'activity'." });
      }

      // Validate the required fields
    if (!touristId || !eventId || !type) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
      // Check if the bookmark already exists
      const existingBookmark = await Bookmark.findOne({ touristId, eventId, type });
      if (existingBookmark) {
        return res.status(400).json({ message: "Event already bookmarked" });
      }
  
      // Create and save the bookmark
      const bookmark = new Bookmark({ touristId, eventId, type });
      await bookmark.save();
  
      res.status(201).json({ message: "Bookmark added successfully", bookmark });
    } catch (error) {
       console.error("Error in addBookmark:", error); // Log any errors
    res.status(500).json({ message: "Error adding bookmark", error });
    }
  };
  

// Get all bookmarks for a tourist
exports.getBookmarks = async (req, res) => {
  try {
    const { touristId } = req.params;
    const { type } = req.query; // Optional filter by type

    // Validate touristId
    if (!mongoose.Types.ObjectId.isValid(touristId)) {
      return res.status(400).json({ message: "Invalid touristId format." });
    }

    // Validate type if provided
    if (type && !["itinerary", "activities"].includes(type)) {
      return res
        .status(400)
        .json({ message: "Invalid type provided. Must be 'itinerary' or 'activities'." });
    }

    // Fetch bookmarks
    const query = { touristId };
    if (type) query.type = type;

    const bookmarks = await Bookmark.find(query);

    // Manually fetch referenced events and ensure all details are populated
    const populatedBookmarks = await Promise.all(
      bookmarks.map(async (bookmark) => {
        let event;
        if (bookmark.type === "activities") {
          event = await Activity.findById(bookmark.eventId).exec(); // Fetch activity details
        } else if (bookmark.type === "itinerary") {
          event = await Itinerary.findById(bookmark.eventId).exec(); // Fetch itinerary details
        }
        return { ...bookmark.toObject(), event };
      })
    );

    // Check if there are no populated bookmarks
    if (populatedBookmarks.length === 0) {
      return res.status(404).json({ message: "No bookmarks found for the tourist." });
    }

    res.status(200).json({ bookmarks: populatedBookmarks });
  } catch (error) {
    console.error("Error in getBookmarks:", error);
    res.status(500).json({ message: "Error retrieving bookmarks", error });
  }
};

  
// Remove a bookmark
exports.removeBookmark = async (req, res) => {
    try {
      const { touristId, eventId, type } = req.body;
  
      // Validate the type field
      if (!["itinerary", "activities"].includes(type)) {
        return res.status(400).json({ message: "Invalid type provided. Must be 'itinerary' or 'activity'." });
      }
  
      // Find and delete the bookmark
      const result = await Bookmark.findOneAndDelete({ touristId, eventId, type });
      if (!result) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
  
      res.status(200).json({ message: "Bookmark removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error removing bookmark", error });
    }
  };
  