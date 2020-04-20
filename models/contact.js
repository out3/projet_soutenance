const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    firstName: {type: String, lowercase: true},
    lastName: {type: String, lowercase: true},
    job: {type: String, lowercase: true},
    email: {type: String, lowercase: true},
    linkedin: {type: String, lowercase: true},
    phoneNumber: { type: String}
})

const Contact = mongoose.model("Contact", contactSchema, "contact");

module.exports = Contact;