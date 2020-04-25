const express = require("express"),
      router = express.Router(),
      passport = require("passport");

const User = require("../models/user")

// Index route
router.get("/", function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect("/companies")
    } else {
        res.redirect("/login")
    }
})

// Register Route
router.get("/register", function (req, res) {
    res.render("users/register");
})

// Register logic
router.post("/register", function (req, res) {
    let newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });
    User.register(newUser, req.body.password, function (err, userCreated) {
        if (err) {
            req.flash("error", err.message)
            return res.render("users/register")
        } else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Bienvenue " + userCreated.firstName + " " + userCreated.lastName + " !")
                res.redirect("/")
            })
        }
    })
})

// Login route
router.get("/login", function (req, res) {
    res.render("users/login");
})

// Login logic

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: "Nom d'utilisateur ou mot de passe invalide."
}), function (req, res) {});

// Logout Route
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Vous avez été déconnecté.")
    res.redirect("/login");
})

module.exports = router;