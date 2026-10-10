const express = require("express");
const router = express.Router();
const {
  createTagsForHistoricalPlaces,
  createTags,
  createHistoricalPlace,
  updateHistoricalPlace,
  deleteHistoricalPlace,
  getAllHistoricalPlaces,
  getHistoricalPlacesByName,
  getHistoricalPlacesByGovernorUsername,
} = require("../controllers/Tourism_Governor");

router
  .route("/createTagsForHistoricalPlaces")
  .post(createTagsForHistoricalPlaces);
router.route("/createTagsForHistoricalPlaces").put(createTags);
router.route("/createHistoricalPlace").post(createHistoricalPlace);
router.route("/updateHistoricalPlace").put(updateHistoricalPlace);
router.route("/deleteHistoricalPlace").delete(deleteHistoricalPlace);
router.route("/getAllHistoricalPlaces").get(getAllHistoricalPlaces);
router.route("/getHistoricalPlacesByName").get(getHistoricalPlacesByName);
router
  .route("/getHistoricalPlacesByGovernorUsername")
  .get(getHistoricalPlacesByGovernorUsername);

module.exports = router;
