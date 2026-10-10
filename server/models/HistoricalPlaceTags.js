const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historicalPlaceTagsSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const HistoricalPlaceTagsSchema = mongoose.model(
  "HistoricalPlaceTagsSchema",
  historicalPlaceTagsSchema
);
module.exports = HistoricalPlaceTagsSchema;
