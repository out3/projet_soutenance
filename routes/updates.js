const express     = require("express"),
      router      = express();

const Update      = require("../models/update"),
      Application = require("../models/application");

const middleware  = require("../middleware");

// New Update page
router.get("/:applicationID/updates/new", middleware.checkApplicationOwnership, function(req, res){
    Application.findById(req.params.applicationID, function(err, foundApplication){
        if (err) {
            console.log(err)
        } else {
            res.render("updates/new", {application: foundApplication});
        }
    })
})

// New update logic
router.post("/:applicationID/updates", middleware.checkApplicationOwnership, function(req, res){
    Application.findById(req.params.applicationID, function(err, foundApplication){
        if (err) {
            console.log(err)
        } else {
            Update.create(req.body.update, function(err, newUpdate){
                if (err) {
                    console.log(err)
                } else {
                    foundApplication.updates.push(newUpdate);
                    foundApplication.save();
                    console.log(newUpdate)
                }
                res.redirect("/applications/" + req.params.applicationID)
            })
        }
    })
})

module.exports = router;