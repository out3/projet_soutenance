const mongoose = require("mongoose");

const User     = require("../models/user"),
      Update   = require("../models/update"),
      Company  = require("../models/company");

var applicationSchema = new mongoose.Schema({
  text: {type: String},
  postedAt: {type: Date, default: Date.now},
  lastUpdated: {type: Date, default: Date.now},
  // 0 : In progress | 1 : Accepted | 2 : Refused
  currentState: {type: Number, min: 0, max: 2, default: 0},
  company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company"
  },
  author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
  },
  updates: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Update"
  }]
})

var Application = mongoose.model("Application", applicationSchema, "application");

module.exports = Application;