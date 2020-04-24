const Company     = require("../models/company"),
      Application = require("../models/application");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash("error", "Vous devez être connecté pour accéder à cette page.")
    res.redirect("/login")
}

middlewareObj.checkCompanyOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Company.findById(req.params.companyID, function(err, foundCompany){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                if(foundCompany.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "Vous n'avez pas la permission pour accéder à cette page.")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "Vous devez être connecté pour accéder à cette page.")
        res.redirect("back")
    }
}

middlewareObj.checkApplicationOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Application.findById(req.params.applicationID, function(err, foundApplication){
            if(err){
                req.flash("error", err.message)
                res.redirect("back")
            } else {
                if(foundApplication.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "Vous n'avez pas la permission pour accéder à cette page.")
                    res.redirect("back")
                }
            }
        })
    } else {
        req.flash("error", "Vous devez être connecté pour accéder à cette page.")
        res.redirect("back")
    }
}

module.exports = middlewareObj;