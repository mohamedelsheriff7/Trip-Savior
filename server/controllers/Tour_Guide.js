const HistoricalPlaceSchema = require("../models/HistoricalPlace.js");
const ActivitySchema = require("../models/Activity.js");
const ItinerarySchema = require("../models/Itinerary.js");

// Function to get all activities associated with a given tour guide's itineraries
// const getAllActivitiesByTourGuideId = async (req, res) => {
//   try {
//     const { tourGuideId } = req.body; // Get tourGuideId from the request body

//     // Step 1: Find all itineraries associated with the tour guide
//     const itineraries = await ItinerarySchema.find({ tourGuideId })
//       .select("activities") // Only select the activities field
//       .populate("activities"); // Populate the activities with their full details

//     // Step 2: Flatten the array of arrays of activities
//     const flattenedActivities = itineraries.reduce((acc, itinerary) => {
//       return acc.concat(itinerary.activities);
//     }, []);

//     // Step 3: Send the flattened array of activities as the response
//     if (flattenedActivities.length === 0) {
//       return res.status(404).json({ message: "No historical places found." });
//     }
//     res.status(200).json(flattenedActivities);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching activities", error: err });
//   }
// };
// Function to get all itineraries associated with a given tour guide's ID
const getItinerariesByTourGuideUsername = async (req, res) => {
  try {
    const { tourGuideUsername } = req.body; // Get tourGuideId from the request body

    // Step 1: Find all itineraries associated with the tour guide
    const itineraries = await ItinerarySchema.find({ tourGuideUsername });

    // Step 2: Send the itineraries as a response
    res.status(200).json(itineraries);
  } catch (err) {
    res.status(500).json({ message: "Error fetching itineraries", error: err });
  }
};
// const getAllHistoricalPlacesByTourGuideId = async (req, res) => {
//   try {
//     const { tourGuideId } = req.body; // Get tourGuideId from the request body

//     // Step 1: Find all itineraries associated with the tour guide
//     const itineraries = await ItinerarySchema.find({ tourGuideId })
//       .select("historicalPlacesToBeVisited")
//       .populate("historicalPlacesToBeVisited");

//     // Step 2: Flatten the array of arrays
//     const flattenedPlaces = itineraries.reduce((acc, itinerary) => {
//       return acc.concat(itinerary.historicalPlacesToBeVisited);
//     }, []);

//     // Step 3: Send the flattened array of places as the response
//     if (flattenedPlaces.length === 0) {
//       return res.status(404).json({ message: "No historical places found." });
//     }
//     res.status(200).json(flattenedPlaces);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching locations", error: err });
//   }
// };
module.exports = {
  // getAllActivitiesByTourGuideId,
  getItinerariesByTourGuideUsername,
  // getAllHistoricalPlacesByTourGuideId,
};
