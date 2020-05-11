const mongoose = require("mongoose");

const User     = require("../models/user"),
      Update   = require("../models/update"),
      Company  = require("../models/company");

var day = 1000 * 60 * 60 * 24 *100;
var randomDate = function () {
  return new Date(Date.now() - (Math.floor(Math.random() * day)));
}

var applicationSchema = new mongoose.Schema({
  text: {type: String},
  postedAt: {type: Date, default: randomDate},
  lastUpdated: {type: Date, default: randomDate},
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