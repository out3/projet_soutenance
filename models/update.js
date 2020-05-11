const mongoose = require("mongoose");

var day = 1000 * 60 * 60 * 24 *100;
var randomDate = function () {
  return new Date(Date.now() - (Math.floor(Math.random() * day)));
}

const updateSchema = new mongoose.Schema({
  text: {type: String },
  postedAt: {type: Date, default: randomDate}
})

const Update = mongoose.model("Update", updateSchema, "update");

module.exports = Update;