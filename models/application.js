const mongoose = require("mongoose");

const User     = require("../models/user"),
      Update   = require("../models/update"),
      Company  = require("../models/company");

var applicationSchema = new mongoose.Schema({
    text: {type: String},
    postedAt: {type: Date, default: Date.now},
    currentState: {type: Number, min: 0, max: 2, default: 0},
    company: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company"
        },
        name: {type: String}
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    updates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Update"
    }]
})

var Application = mongoose.model("Application", applicationSchema);

module.exports = Application;