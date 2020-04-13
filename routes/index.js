const express   = require("express");
      router    = express.Router(),
      passport  = require("passport"),
      User      = require("../models/user") 

// Index route
router.get("/", function(req, res){
    res.send("Index route");
})

// Register Route
router.get("/register", function(req, res){
    res.send("Register router");
})

// Register logic
router.post("/register", function(req, res){
    res.send("You have been registered")
})

// Login route
router.get("/login", function(req,res){
    res.send("Login route");
})

// Login logic
router.post("/login", function(req, res){
    res.send("You got logged on")
})

// Logout Route
router.get("/logout", function(req, res){
    res.send("Logout")
})

module.exports = router;