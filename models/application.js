const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
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

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;