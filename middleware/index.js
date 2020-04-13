var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

middlewareObj.checkCompanyOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Company.findById(req.params.companyID, function(err, foundCompany){
            if(err){
                console.log(err)
            } else {
                if(foundCompany.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back")
                }
            }
        })
    } else {
        res.redirect("back")
    }
}

module.exports = middlewareObj;