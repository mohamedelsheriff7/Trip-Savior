const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    notifications: [{ message: String }],
  },
  { timestamps: true },
  { collection: "admin" }
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
