const mongoose = require("mongoose");

const User     = require("../models/user"),
      Contact  = require("../models/contact");

const companySchema = new mongoose.Schema({
  name: String,
  address: {type: String, lowercase: true},
  postalCode: { type: String },
  city: {type: String, lowercase: true},
  phoneNumber: { type: String },
  links: {
    website: {type: String, lowercase: true},
    linkedin: {type: String, lowercase: true}
  },
  author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
  },
  contacts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contact"
  }]
})

const Company = mongoose.model("Company", companySchema, "company");

module.exports = Company;