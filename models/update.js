const mongoose = require("mongoose");

const updateSchema = new mongoose.Schema({
    text: {type: String },
    postedAt: {type: Date, default: Date.now}
})

const Update = mongoose.model("Update", updateSchema, "update");

module.exports = Update;