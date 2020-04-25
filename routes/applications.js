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
    Application.find({author: {id: req.user._id}}, function(err, allApplications){
        let excludeCompanyId = [];
        allApplications.forEach(application => {
           excludeCompanyId.push(application.company.id)
        });
        Company.find({
            author: {id: req.user._id},
           _id: {$nin : excludeCompanyId}
        }, function(err, allCompanies){
            if (err) {
                req.flash("error", err.message);
                return res.redirect("/")
            } else {
                res.render("applications/new", {companies: allCompanies})
            }
        })
    })
})

// New Application Logic
router.post("/", middleware.isLoggedIn, function(req, res){
    Application.find({author: {id: req.user._id}}, function(err, allApplications){
        let excludeCompanyId = [];
        allApplications.forEach(application => {
           excludeCompanyId.push(application.company.id.toString())
        });
        Company.findById(req.body.company, function(err, foundCompany){
            if (err) {
                req.flash("error", err.message)
                res.redirect("/applications")
            } else {
                if (!excludeCompanyId.includes(foundCompany._id.toString())){
                    let newApplication = req.body.application;
                    newApplication.author = {id: req.user._id};
                    newApplication.company = {
                        id: foundCompany._id,
                        name: foundCompany.name
                    };
                    Application.create(newApplication, function(err, createdApplication){
                        if (err) {
                            req.flash("error", err.message);
                            res.redirect("/applications/new")
                        } else {
                            req.flash("success", "Votre candidature a bien été créée.")
                            res.redirect("/applications")
                        }
                    })
                } else {
                    req.flash("error", "Une candidature existe déjà pour cette entreprise.")
                    res.redirect("/applications")
                }
            }
        })
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

// Change application state to accepted
router.put("/:applicationID/state/accepted", middleware.checkIfApplicationIsNotClosed, function(req, res){
    Application.findByIdAndUpdate(req.params.applicationID, {currentState: 1}, function(err, updatedApplication){
        if (err) {
            req.flash("error", err.message)
            res.redirect("/applications/" + req.params.applicationID)
        } else {
            req.flash("info", "La candidature a été acceptée ! Aucune modification n'est possible à présent.")
            res.redirect("/applications/" + req.params.applicationID)
        }
    })
})

// Change application state to refused
router.put("/:applicationID/state/refused", middleware.checkIfApplicationIsNotClosed, function(req, res){
    Application.findByIdAndUpdate(req.params.applicationID, {currentState: 2}, function(err, updatedApplication){
        req.flash("info", "La candidature a été refusée. Aucune modification n'est possible à présent.")
        res.redirect("/applications/" + req.params.applicationID)
    })
});

module.exports = router;