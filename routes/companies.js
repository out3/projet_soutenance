const express    = require("express"),
      router     = express.Router();

const Company    = require("../models/company"),
      Contact    = require("../models/contact");

const middleware = require("../middleware");


// Show Index route
router.get("/", middleware.isLoggedIn, function(req, res){
    Company.find({author: {id: req.user._id}}, function(err, allCompanies){
        if (err) {
            req.flash("error", err.message)
            return res.redirect("/")
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
            req.flash("error", err.message);
            return res.redirect("/companies");
        } else {
            req.flash("success", "L'entreprise \"" + companyCreated.name + "\" a bien été créée.")
            res.redirect("/companies");
        }
    })
})

// Show company route
router.get("/:companyID", middleware.isLoggedIn, function(req, res){
    Company.findById(req.params.companyID).populate("contacts").exec(function(err, foundCompany){
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/companies");
        } else {
            res.render("companies/show", {company: foundCompany})
        }
    })
})

// Edit company route
router.get("/:companyID/edit", middleware.checkCompanyOwnership, function(req, res){
    Company.findById(req.params.companyID, function(err, foundCompany){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/companies/" + req.params.companyID);
        }else{
            res.render("companies/edit", {company: foundCompany})
        }
    })
})

// Edit company logic
router.put("/:companyID", middleware.checkCompanyOwnership, function(req, res){
    let newCompany = req.body.company;
    newCompany.links = req.body.links
    Company.findByIdAndUpdate(req.params.companyID, newCompany, function(err, companyUpdated){
        req.flash("success", "Modification réalisée avec succés.");
        res.redirect("/companies/" + req.params.companyID);
    })
})

// Delete company + contacts logic
router.delete("/:companyID", middleware.checkCompanyOwnership, function(req, res){
    Company.findByIdAndDelete(req.params.companyID, function(err, removedCompany){
        console.log(removedCompany)
        for(const contact of removedCompany.contacts){
            Contact.findByIdAndDelete(contact, function(err, removedContact){
                if(err){
                    req.flash("error", err.message)
                    return res.redirect("/companies")
                }
            })
        }
        req.flash("success", "Suppression réalisée avec succés.")
        res.redirect("/companies")
    })
})
module.exports = router;