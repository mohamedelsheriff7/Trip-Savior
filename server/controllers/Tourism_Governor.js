const HistoricalPlaceSchema = require("../models/HistoricalPlace.js");
const HistoricalPlaceTagsSchema = require("../models/HistoricalPlaceTags.js");
// fl frontend el user hy7ot name el hta el 3ayz y3mlha
// tag gdeed wyktb type w period whna n7otaha f json form
// wnsend it as a put request 3shan update
const createTags = async (req, res) => {
  try {
    const updated = await HistoricalPlaceSchema.findByIdAndUpdate(
      req.body._id,
      {
        $addToSet: { tags: { $each: req.body.tags } }, // Adds tags without duplicates
      },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
};
const createTagsForHistoricalPlaces = async (req, res) => {
  try {
    const newTag = new HistoricalPlaceTagsSchema(req.body);
    const savedtag = await newTag.save();
  } catch (err) {
    console.error("Error occurred while saving:", err); // Log the error details
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
const createHistoricalPlace = async (req, res) => {
  console.log("Route hit");
  try {
    console.log("Request Body:", req.body); // Log the incoming request data
    const newHistoricalPlace = new HistoricalPlaceSchema(req.body);
    const savedPlace = await newHistoricalPlace.save();
    console.log("Saved Historical Place:", savedPlace); // Log the saved data
    res.status(200).json(savedPlace);
  } catch (err) {
    console.error("Error occurred while saving:", err); // Log the error details
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};
//nfs hwar el tags
const updateHistoricalPlace = async (req, res) => {
  try {
    const beforeUpdate = await HistoricalPlaceSchema.findOne({
      name: { $regex: req.body.name, $options: "i" },
    });
    if (!beforeUpdate) {
      return res.status(404).json({ message: "Historical place not found" });
    }
    const updated = await HistoricalPlaceSchema.findByIdAndUpdate(
      beforeUpdate._id,
      { ...req.body },
      { new: true } //return el updated document bs
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json(err);
  }
};
const deleteHistoricalPlace = async (req, res) => {
  try {
    const toBeDeleted = await HistoricalPlaceSchema.findOne({
      name: { $regex: req.body.name, $options: "i" },
    });
    if (!toBeDeleted) {
      return res.status(404).json({ message: "Historical place not found" });
    }
    const updated = await HistoricalPlaceSchema.findByIdAndDelete(
      toBeDeleted._id
    );
    res.status(200).json(`deleted: ${toBeDeleted}`);
  } catch (err) {
    res.status(500).json(err);
  }
};
const getAllHistoricalPlaces = async (req, res) => {
  try {
    const historicalPlaces = await HistoricalPlaceSchema.find();
    res.status(200).json(historicalPlaces);
  } catch (err) {
    res.status(500).json(err);
  }
};
const getHistoricalPlacesByName = async (req, res) => {
  try {
    const { name: searchName } = req.query; // Get the name to search from request body
    const places = await HistoricalPlaceSchema.findOne({
      name: { $regex: searchName, $options: "i" },
    });
    res.status(200).json(places);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching historical places", error: err });
  }
};
// const getHistoricalPlacesByGovernorId = async (req, res) => {
//   try {
//     const { governorId } = req.body;
//     const historicalPlaces = await HistoricalPlaceSchema.find({ governorId });

//     res.status(200).json(historicalPlaces);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching places", error: err });
//   }
// };
const getHistoricalPlacesByGovernorUsername = async (req, res) => {
  try {
    const { governorUsername } = req.body;
    //et2kd en el username tmam
    const historicalPlaces = await HistoricalPlaceSchema.find({
      governorUsername,
    });

    res.status(200).json(historicalPlaces);
  } catch (err) {
    res.status(500).json({ message: "Error fetching places", error: err });
  }
};

module.exports = {
  createTagsForHistoricalPlaces,
  createTags,
  createHistoricalPlace,
  updateHistoricalPlace,
  deleteHistoricalPlace,
  getAllHistoricalPlaces,
  getHistoricalPlacesByName,
  getHistoricalPlacesByGovernorUsername,
};
