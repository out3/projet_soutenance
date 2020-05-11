const express     = require("express"),
      router      = express.Router(),
      passport    = require("passport");

const User        = require("../models/user")

const middleware  = require("../middleware")
// Index route
router.get("/", function (req, res) {
  res.render("home/index");
})

// Register Route
router.get("/register", function (req, res) {
  res.render("users/register");
})

// Register logic
router.post("/register", async function (req, res){
  try{
    let newUser = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    });
    let userCreated = await User.register(newUser, req.body.password);
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Bienvenue " + userCreated.firstName + " " + userCreated.lastName + " !")
      res.redirect("/")
    })
  }catch(err){
    req.flash("error", err.message)
    return res.render("users/register")
  }
})

// Login route
router.get("/login", function (req, res) {
  if(req.isAuthenticated()){
    if(req.user.isAdmin){
      res.redirect("/admin/overview");
    } else{
      res.redirect("/applications")
    }
  } else {
      res.render("users/login");
  }
})

// Login logic
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: "Nom d'utilisateur ou mot de passe invalide."
}), function (req, res) {
  res.redirect(middleware.loginRedirect(req, res))
});

// Logout Route
router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "Vous avez été déconnecté.")
  res.redirect("/");
})

module.exports = router;