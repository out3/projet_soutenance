const express    = require("express"),
		  router     = express.Router();

const Company    = require("../models/company"),
		  Contact    = require("../models/contact");

const middleware = require("../middleware");


// Show Index route
router.get("/", middleware.isLoggedIn, async function(req, res){
	try {
		let allCompanies = await Company.find({author: req.user._id});
		res.render("companies/index", {companies: allCompanies})
	} catch(err){
		req.flash("error", err.message);
		res.redirect("/")
	}
})

// New company route
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("companies/new")
})

// New company Logic
router.post("/", middleware.isLoggedIn, async function(req, res){
	try {
		// Retrieve data from form
		let newCompany = {
			name: req.body.name,
			address: req.body.address,
			postalCode: req.body.postalCode,
			city: req.body.city,
		phoneNumber: req.body.phoneNumber,
		links: {
			website: req.body.website,
			linkedin: req.body.linkedin
		},
		author: req.user._id
		};
		let createdCompany = await Company.create(newCompany);
		req.flash("success", "L'entreprise \"" + createdCompany.name + "\" a bien été créée.")
		res.redirect("/companies");
	}catch(err){
		req.flash("error", err.message);
		res.redirect("/companies");
	}
})

// Show company route
router.get("/:companyID", middleware.isLoggedIn, async function(req, res){
	try{
		let foundCompany = await Company.findById(req.params.companyID).populate("contacts");
		res.render("companies/show", {company: foundCompany})
	}catch(err){
		req.flash("error", err.message);
		res.redirect("/companies");
	}
})

// Edit company route
router.get("/:companyID/edit", middleware.checkCompanyOwnership, async function(req, res){
	try{
		let foundCompany = await Company.findById(req.params.companyID);
		res.render("companies/edit", {company: foundCompany});
	}catch(err){
		req.flash("error", err.message);
	  res.redirect("/companies/" + req.params.companyID);
	}
})

// Edit company logic
router.put("/:companyID", middleware.checkCompanyOwnership, async function(req, res){
	try{
		let newCompany = {
			address: req.body.address,
			postalCode: req.body.postalCode,
			city: req.body.city,
			phoneNumber: req.body.phoneNumber,
			links: {
				website: req.body.website,
				linkedin: req.body.linkedin
			}
		}
		let updatedCompany = await Company.findByIdAndUpdate(req.params.companyID, newCompany)
		req.flash("success", "Modification réalisée avec succés.");
		res.redirect("/companies/" + updatedCompany._id);
	}catch(err){
		req.flash("error", err.message);
		res.redirect("/companies/" + req.params.companyID)
	}
})

module.exports = router;