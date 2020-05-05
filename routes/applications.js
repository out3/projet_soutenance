const express     = require("express"),
		  router      = express.Router();

const Application = require("../models/application"),
	  	Company     = require("../models/company");

const middleware  = require("../middleware");

// Show Index Page
router.get("/", middleware.isLoggedIn, async function(req, res){
	try {
		let allApplications = await Application.find({author: req.user._id}).sort([['lastUpdated', -1]]).populate('updates').populate('company')
		res.render("applications/index", {applications: allApplications})
	} catch(err){
		req.flash('error', req.message)
		res.redirect("/")
	}
})

// Show New application Page
router.get("/new", middleware.isLoggedIn, async function(req, res){
	try {
		let allApplications = await Application.find({author: req.user._id}).populate("company");
		let excludeCompanyId = [];
		for (const application of allApplications){
			excludeCompanyId.push(application.company._id)
		};
		let allCompanies = await Company.find({
			author: req.user._id,
			_id: {$nin : excludeCompanyId}
		});
		res.render('applications/new', { companies:allCompanies });
	} catch(err){
		req.flash('err', req.message)
		res.redirect("/")
	}
})

// New Application Logic
router.post("/", middleware.isLoggedIn, async function(req, res){
	try {
		let allApplications = await Application.find({author: req.user._id}).populate("company");
		let excludeCompanyId = [];
		for (const application of allApplications){
			excludeCompanyId.push(application.company.id.toString())
		};
		let foundCompany = await Company.findById(req.body.company);
		if (!excludeCompanyId.includes(foundCompany._id.toString())){
			let newApplication = {
				text: req.body.text,
				company: foundCompany._id,
				author: req.user._id
			};
			let createdApplication = await Application.create(newApplication);
			req.flash("success", "Votre candidature a bien été créée.")
			res.redirect("/applications")
		} else {
			req.flash("error", "Une candidature existe déjà pour cette entreprise.")
			res.redirect("/applications")		
		}
	} catch(err){
		req.flash("error", err.message)
		res.redirect("/applications")
	}
});

// Show application page
router.get("/:applicationID", middleware.isLoggedIn, async function(req, res){
	try{
		let foundApplication = await Application.findById(req.params.applicationID).populate("updates").populate("company")
		res.render("applications/show", {application: foundApplication})
	}catch(err) {
		req.flash("error", err.message)
		return res.redirect("/applications")
	}
})

// Change application state to accepted
router.put("/:applicationID/state/accepted", middleware.checkIfApplicationIsNotClosed, async function(req, res){
	try{
		let updatedApplication = await Application.findByIdAndUpdate(req.params.applicationID, {
			currentState: 1,
			lastUpdated: Date.now()
		});
		req.flash("success", "La candidature a été acceptée ! Aucune modification n'est possible à présent.")
		res.redirect("/applications/" + updatedApplication._id)
	}catch(err){
		req.flash("error", err.message)
		res.redirect("/applications/" + req.params.applicationID)
	}
});

// Change application state to refused
router.put("/:applicationID/state/refused", middleware.checkIfApplicationIsNotClosed, async function(req, res){
	try {
		let updatedApplication = await Application.findByIdAndUpdate(req.params.applicationID, {
			currentState: 2,
			lastUpdated: Date.now()
		});
		req.flash("success", "La candidature a été refusée. Aucune modification n'est possible à présent.")
		res.redirect("/applications/" + updatedApplication._id)
	}catch(err){
		req.flash("error", err.message)
		res.redirect("/applications/" + req.params.applicationID)
	}
});

module.exports = router;