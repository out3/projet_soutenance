const express   = require("express");
      router    = express.Router(),
      passport  = require("passport"),
      User      = require("../models/user") 

// Index route
router.get("/", function(req, res){
    if(req.isAuthenticated()){
        res.redirect("/companies")
    } else {
        res.redirect("/login")
    }
})

// Register Route
router.get("/register", function(req, res){
    res.render("users/register");
})

// Register logic
router.post("/register", function(req, res){
    let newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });
    User.register(newUser, req.body.password, function (err, userCreated){
        if (err) {
            console.log(err)
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/")
            })
        }
    })
})

// Login route
router.get("/login", function(req,res){
    res.render("users/login");
})

// Login logic

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}), function(req, res){
});

// Logout Route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})

module.exports = router;