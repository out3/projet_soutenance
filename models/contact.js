const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    firstName: {type: String, lowercase: true},
    lastName: {type: String, lowercase: true},
    email: {type: String, lowercase: true},
    linkedin: {type: String, lowercase: true},
    phoneNumber: { type: Number, min: 0000000000, max : 9999999999}
})

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;