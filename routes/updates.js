const express     = require("express"),
		  router      = express();

const Update      = require("../models/update"),
		  Application = require("../models/application");

const middleware  = require("../middleware");

// New Update page
router.get("/:applicationID/updates/new", middleware.checkApplicationOwnership, middleware.checkIfApplicationIsNotClosed, async function(req, res){
	try{
		let foundApplication = await Application.findById(req.params.applicationID).populate("company")
		res.render("updates/new", {application: foundApplication}) 
	}catch(err){
		req.flash("error", err.message);
		return res.redirect("/applications/" + req.params.applicationID);
	}
})

// New update logic
router.post("/:applicationID/updates", middleware.checkApplicationOwnership, middleware.checkIfApplicationIsNotClosed, async function(req, res){
	try{
		let foundApplication = await Application.findById(req.params.applicationID);
		let inputUpdate = {text: req.body.text};
		let createdUpdate = await Update.create(inputUpdate)
		foundApplication.updates.push(createdUpdate._id);
		foundApplication.lastUpdated = createdUpdate.postedAt;
		foundApplication.save();
		res.redirect("/applications/" + foundApplication._id)
	}catch(err){
		req.flash("error", err.message);
		res.redirect("/applications/" + req.params.applicationID);
	}
})

module.exports = router;