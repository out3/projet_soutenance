const express    = require("express");
      router     = express.Router(),
      Company    = require("../models/company"),
      Contact    = require("../models/contact"),
      middleware = require("../middleware");

// New contact form
router.get("/:companyID/contacts/new", middleware.checkCompanyOwnership, function(req, res){
    Company.findById(req.params.companyID, function(err, foundCompany){
        if(err){
            console.log(err)
        } else {
            res.render("contacts/new", {company: foundCompany})
        }
    })
})

// New contact logic
router.post("/:companyID/contacts/", middleware.checkCompanyOwnership, function(req, res){
    Company.findById(req.params.companyID, function(err, foundCompany){
        if (err){
            console.log(err)
        } else {
            Contact.create(req.body.contact, function(err, newContact){
                if(err){
                    console.log(err)
                } else {
                    foundCompany.contacts.push(newContact);
                    foundCompany.save()
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
            console.log(err)
        } else {
            res.render("contacts/edit", {contact: foundContact, companyID: req.params.companyID})
        }
    })
})
// Edit contact logic
router.put("/:companyID/contacts/:contactID", middleware.checkCompanyOwnership, function(req, res){
    Contact.findByIdAndUpdate(req.params.contactID, req.body.contact, function(err, updatedContact){
        if(err){
            console.log(err)
        }else{
            console.log(req.params.contactID)
            console.log("------------------")
            console.log(updatedContact)
            res.redirect("/companies/" + req.params.companyID)
        }
    })
})

router.delete("/:companyID/contacts/:contactID/", middleware.checkCompanyOwnership, function(req, res){
    Contact.findByIdAndDelete(req.params.contactID, function(err, deletedContact){
        if (err) {
            console.log(err)
        } else {
            res.redirect("/companies/" + req.params.companyID)
        }
    })
})
module.exports = router;