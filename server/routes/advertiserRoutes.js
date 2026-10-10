const express = require("express");
const router = express.Router();
const {
  getActivitiesByAdvertiserId,
  getAllActivities,
} = require("../controllers/AdvertiserController");
router.route("/getAllActivities").get(getAllActivities);
router.route("/getActivitiesByAdvertiserId").get(getActivitiesByAdvertiserId);

module.exports = router;
