const mongoose = require("mongoose")
      User     = require("../models/user"),
      Contact  = require("../models/contact");

const companySchema = new mongoose.Schema({
    name: String,
    address: {type: String, lowercase: true},
    postalCode: { type: Number, min: 00000, max : 99999},
    city: {type: String, lowercase: true},
    phoneNumber: { type: Number, min: 0000000000, max : 9999999999},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contact"
    }]
})

const Company = mongoose.model("Company", companySchema);

module.exports = Company;