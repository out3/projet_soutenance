const express     = require("express"),
      router      = express.Router();

const Application = require("../models/application"),
      Company     = require("../models/company");

const middleware  = require("../middleware");

// Show Index Page
router.get("/", middleware.isLoggedIn, function(req, res){
    Application.find({author: {id: req.user._id}}).populate("updates").exec(function(err, allApplications){
        if (err) {
            req.flash("error", req.message);
            return res.redirect("/")
        } else {
            res.render("applications/index", {applications: allApplications})
        }
    })
})

// Show New Page
router.get("/new", middleware.isLoggedIn, function(req, res){
    Company.find({author: {id: req.user._id}}, function(err, allCompanies){
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/")
        } else {
            res.render("applications/new", {companies: allCompanies})
        }
    })
})

// New Application Logic
router.post("/", middleware.isLoggedIn, function(req, res){
    Company.findById(req.body.company, function(err, foundCompany){
        if (err) {
            console.log(err)
        } else {
            let newApplication = req.body.application;
            newApplication.author = {id: req.user._id};
            newApplication.company = {
                id: foundCompany._id,
                name: foundCompany.name
            };
            Application.create(newApplication, function(err, createdApplication){
                if (err) {
                    req.flash("error", err.message);
                    return res.redirect("/applications/new")
                } else {
                    req.flash("success", "Votre candidature a bien été créée.")
                    res.redirect("/applications")
                }
            })
        }
    })
   
})

// Show application page
router.get("/:applicationID", middleware.isLoggedIn, function(req, res){
    Application.findById(req.params.applicationID).populate("updates").exec(function(err, foundApplication){
        if (err) {
            req.flash("error", err.message)
            return res.redirect("/applications")
        } else {
            res.render("applications/show", {application: foundApplication})
        }
    })
})


module.exports = router;