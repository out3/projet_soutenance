const mongoose = require("mongoose");

const updateSchema = new mongoose.Schema({
    text: String,
    postedAt: {type: Date, default: Date.now}
})

const Update = mongoose.model("Update", updateSchema);

module.exports = Update;