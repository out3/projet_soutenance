const mongoose = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: {type: String, lowercase: true},
    password: {type: String },
    firstName: {type: String, lowercase: true},
    lastName: {type: String, lowercase: true}
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User", userSchema, "user");

module.exports = User;