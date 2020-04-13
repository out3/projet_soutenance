const mongoose = require("mongoose"),
      User     = require("../models/user"),
      Update   = require("../models/update");

var applicationSchema = new mongoose.Schema({
    text: String,
    postedAt: {type: Date, default: Date.now},
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