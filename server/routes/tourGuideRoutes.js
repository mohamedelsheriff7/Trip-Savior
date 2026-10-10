const express = require("express");
const router = express.Router();
const {
  // getAllActivitiesByTourGuideId,
  getItinerariesByTourGuideUsername,
  // getAllHistoricalPlacesByTourGuideId,
} = require("../controllers/Tour_Guide");

// router
//   .route("/getAllActivitiesByTourGuideId")
//   .get(getAllActivitiesByTourGuideId);
router
  .route("/getItinerariesByTourGuideUsername")
  .get(getItinerariesByTourGuideUsername);
// router
//   .route("/getAllHistoricalPlacesByTourGuideId")
//   .get(getAllHistoricalPlacesByTourGuideId);

module.exports = router;
