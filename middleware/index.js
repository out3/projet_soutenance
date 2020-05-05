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

middlewareObj.checkCompanyOwnership = async function(req, res, next){
  try {
    if(req.isAuthenticated()){
      let foundCompany = await Company.findById(req.params.companyID)
      if (foundCompany.author.equals(req.user._id)){
        next()
      } else {
        req.flash("error", "Vous n'avez pas la permission pour accéder à cette page.")
        res.redirect("back")
      }
    } else {
      req.flash("error", "Vous devez être connecté pour accéder à cette page.")
      res.redirect("back")
    }
  } catch(err){
    req.flash("error", err.message);
    res.redirect("back")
  }
}

middlewareObj.checkApplicationOwnership = async function(req, res, next){
  try {
    if(req.isAuthenticated()){
      let foundApplication = await Application.findById(req.params.applicationID)
      if(foundApplication.author.equals(req.user._id)){
        next()
      } else {
        req.flash("error", "Vous n'avez pas la permission pour accéder à cette page.")
        res.redirect("back")
      }
    } else {
      req.flash("error", "Vous devez être connecté pour accéder à cette page.")
      res.redirect("back")
    }
  } catch(err){
    req.flash("error", err.message);
    res.redirect("back")
  }
}

middlewareObj.checkIfApplicationIsNotClosed = async function(req, res, next){
  try{
    let foundApplication = await Application.findById(req.params.applicationID);
    if(foundApplication.currentState === 0){
      next()
    } else{
      req.flash("error", "Cette candidature a déjà été traitée. Aucune modification n'est possible.")
      res.redirect("back")
    }
  }catch(err){
    req.flash("error", err.message)
    res.redirect("back");
  }
}

module.exports = middlewareObj;