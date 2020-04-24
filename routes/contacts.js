const express    = require("express"),
      router     = express.Router();

const Company    = require("../models/company"),
      Contact    = require("../models/contact");

const middleware = require("../middleware");

// New contact form
router.get("/:companyID/contacts/new", middleware.checkCompanyOwnership, function(req, res){
    Company.findById(req.params.companyID, function(err, foundCompany){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/companies/" + req.params.companyID);
        } else {
            res.render("contacts/new", {company: foundCompany})
        }
    })
})

// New contact logic
router.post("/:companyID/contacts/", middleware.checkCompanyOwnership, function(req, res){
    Company.findById(req.params.companyID, function(err, foundCompany){
        if (err){
            req.flash("error", err.message);
            return res.redirect("/companies");
        } else {
            Contact.create(req.body.contact, function(err, newContact){
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("/companies/" + req.params.companyID);
                } else {
                    foundCompany.contacts.push(newContact);
                    foundCompany.save()
                    req.flash("success", "Le contact " + newContact.firstName + " " + newContact.lastName + " a bien été créé.")
                    res.redirect("/companies/" + req.params.companyID)
                }
            })
        }
    })
})

// Edit contact form
router.get("/:companyID/contacts/:contactID/edit", middleware.checkCompanyOwnership, function(req, res){
    Contact.findById(req.params.contactID, function(err, foundContact){
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/companies/" + req.params.companyID);
        } else {
            res.render("contacts/edit", {contact: foundContact, companyID: req.params.companyID})
        }
    })
})
// Edit contact logic
router.put("/:companyID/contacts/:contactID", middleware.checkCompanyOwnership, function(req, res){
    Contact.findByIdAndUpdate(req.params.contactID, req.body.contact, function(err, updatedContact){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/companies/" + req.params.companyID);
        }else{
            req.flash("success", "Modification réalisée avec succés.")
            res.redirect("/companies/" + req.params.companyID)
        }
    })
})

router.delete("/:companyID/contacts/:contactID/", middleware.checkCompanyOwnership, function(req, res){
    Contact.findByIdAndDelete(req.params.contactID, function(err, deletedContact){
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/companies/" + req.params.companyID);
        } else {
            req.flash("success", "Suppression réalisée avec succés.")
            res.redirect("/companies/" + req.params.companyID)
        }
    })
})

module.exports = router;