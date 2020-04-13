const mongoose = require("mongoose");

const updateSchema = new mongoose.Schema({
    text: String,
    postedAt: {type: Date, default: Date.now}
})

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;