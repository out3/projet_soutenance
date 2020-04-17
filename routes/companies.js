const express    = require("express");
      router     = express.Router(),
      Company    = require("../models/company"),
      middleware = require("../middleware");


// Show Index route
router.get("/", middleware.isLoggedIn, function(req, res){
    Company.find({author: {id: req.user._id}}, function(err, allCompanies){
        if (err) {
            console.log(err)
        } else {
            res.render("companies/index", {companies: allCompanies})
        }
    })
})
// New company route
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("companies/new")
})

// New company Logic
router.post("/", middleware.isLoggedIn, function(req, res){
    // Retrieve data from form
    let newCompany = req.body.company;
    newCompany.author = {id: req.user._id};
    newCompany.links = req.body.links
    // Create new company entry
    Company.create(newCompany, function(err, companyCreated){
        if (err) {
            console.log(err)
        } else {
            console.log(companyCreated)
        }
    })
    res.redirect("/companies")
})

// Show company route
router.get("/:companyID", middleware.isLoggedIn, function(req, res){
    Company.findById(req.params.companyID, function(err, foundCompany){
        if (err) {
            console.log(err)
        } else {
            res.render("companies/show", {company: foundCompany})
        }
    })
})

// Edit company route
router.get("/:companyID/edit", middleware.checkCompanyOwnership, function(req, res){
    Company.findById(req.params.companyID, function(err, foundCompany){
        if(err){
            console.log(err)
        }else{
            res.render("companies/edit", {company: foundCompany})
        }
    })
})

// Edit company logic
router.put("/:companyID", middleware.checkCompanyOwnership, function(req, res){
    let newCompany = req.body.company;
    newCompany.links = req.body.links
    Company.findOneAndUpdate(req.params.companyID, newCompany, function(err, companyUpdated){
        res.redirect("/companies/" + req.params.companyID)
    })
})

// Delete company logic
router.delete("/:companyID", middleware.checkCompanyOwnership, function(req, res){
    Company.findOneAndDelete(req.params.companyID, function(err, companyRemoved){
        res.redirect("/companies")
    })
})
module.exports = router;