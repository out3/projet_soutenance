const mongoose = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: {type: String, lowercase: true},
    password: String,
    firstName: {type: String, lowercase: true},
    lastName: {type: String, lowercase: true},
    isAdmin: {type: Boolean, default: false}
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User", userSchema);

module.exports = User;