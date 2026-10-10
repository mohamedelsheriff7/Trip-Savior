const ActivitySchema = require("../models/Activity.js");
const getActivitiesByAdvertiserId = async (req, res) => {
  try {
    const { advertiserId } = req.body;
    const activities = await ActivitySchema.find({ advertiserId });

    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ message: "Error fetching activities", error: err });
  }
};
const getAllActivities = async (req, res) => {
  try {
    const activities = await ActivitySchema.find();
    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json(err);
  }
};
module.exports = { getActivitiesByAdvertiserId, getAllActivities };
