const express    = require("express"),
			router     = express.Router();

const Company    = require("../models/company"),
			Contact    = require("../models/contact");

const middleware = require("../middleware");

// New contact form
router.get("/:companyID/contacts/new", middleware.checkCompanyOwnership, async function(req, res){
	try{
		let foundCompany = await Company.findById(req.params.companyID);
		res.render("contacts/new", {company: foundCompany})
	}catch(err){
		req.flash("error", err.message);
		return res.redirect("/companies/" + req.params.companyID);
	}
})

// New contact logic
router.post("/:companyID/contacts/", middleware.checkCompanyOwnership, async function(req, res){
	try{
		let foundCompany = await Company.findById(req.params.companyID);
		let inputContact = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			job: req.body.job,
			phoneNumber: req.body.phoneNumber,
			email: req.body.email,
			linkedin: req.body.linkedin
		}
		let createdContact = await Contact.create(inputContact);
		foundCompany.contacts.push(createdContact);
		foundCompany.save()
		req.flash("success", "Le contact " + inputContact.firstName + " " + inputContact.lastName + " a bien été créé.")
		res.redirect("/companies/" + foundCompany._id)
	}catch(err){
		req.flash("error", err.message);
		return res.redirect("/companies");
	}
})

// Edit contact form
router.get("/:companyID/contacts/:contactID/edit", middleware.checkCompanyOwnership, async function(req, res){
	try{
		let foundContact = await Contact.findById(req.params.contactID);
		res.render("contacts/edit", {contact: foundContact, companyID: req.params.companyID})
	}catch(err){
		req.flash("error", err.message);
		return res.redirect("/companies/" + req.params.companyID);
	}
})

// Edit contact logic
router.put("/:companyID/contacts/:contactID", middleware.checkCompanyOwnership, async function(req, res){
	try{
		let inputContact = {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			job: req.body.job,
			phoneNumber: req.body.phoneNumber,
			email: req.body.email,
			linkedin: req.body.linkedin
		}
		let updatedContact = await Contact.findByIdAndUpdate(req.params.contactID, inputContact);
		req.flash("success", "Modification réalisée avec succés.")
		res.redirect("/companies/" + req.params.companyID)
	}catch(err){
		req.flash("error", err.message);
		return res.redirect("/companies/" + req.params.companyID);
	}
})

module.exports = router;