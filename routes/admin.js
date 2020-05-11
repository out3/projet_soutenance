// Import Packages
const express     = require("express"),
      router      = express.Router(),
      passport    = require("passport");

// Import models
const User        = require("../models/user"),
      Application = require("../models/application"),
      Update      = require("../models/update"),
      Company     = require("../models/company"),
      Contact     = require("../models/contact");

// Import middlewares
const middleware  = require("../middleware");

// Functions
createLogs = function(applications){
  allLogs = []
  for(const app of applications){
    // Push applications
    allLogs.push({
      postedAt: app.postedAt,
    author: {
      _id: app.author._id,
      firstName: app.author.firstName,
      lastName: app.author.lastName
    },
    company: {
      name: app.company.name,
      city: app.company.city
    },
    type: 0
    })
    // Push updates
    for(let i = 0; i < app.updates.length; i++){
      allLogs.push({
        postedAt: app.updates[i].postedAt,
        author: {
          _id: app.author._id,
          firstName: app.author.firstName,
          lastName: app.author.lastName
        },
        company: {
          name: app.company.name,
          city: app.company.city
        },
        type: 1
      })
    }
    // Push accepted
    if (app.currentState === 1){
      allLogs.push({
        postedAt: app.lastUpdated,
        author: {
          _id: app.author._id,
          firstName: app.author.firstName,
          lastName: app.author.lastName
        },
        company: {
          name: app.company.name,
          city: app.company.city
        },
        type: 2
      })
    }
    // Push refused
    if (app.currentState === 2){
      allLogs.push({
        postedAt: app.lastUpdated,
        author: {
          _id: app.author._id,
          firstName: app.author.firstName,
          lastName: app.author.lastName
        },
        company: {
          name: app.company.name,
          city: app.company.city
        },
        type: 3
      })
    }
  }
  return allLogs
}

// Global overview page
router.get("/overview", middleware.isLoggedInAsAdmin, async function(req, res){
  try{
    let allApplications = await Application.find().populate('author').populate('updates').populate('company');
    let students = await User.find({isAdmin: {$ne: true}});
    // Recent activity //
    let allLogs = createLogs(allApplications)
    // Graph 1 //
    let foundInternship = {
      yes: 0,
      no: 0
    }
    for(const student of students){
      let keep = true
      let applications = await Application.find({author: student._id })
      for (const app of applications){
        if(app.currentState == 1){
          foundInternship.yes++
          keep = false
          break;
        } 
      }
      if(keep){
        foundInternship.no++
      }
    }
    // GRAPH 2 //
    let test = "abc"
    // res.send(sortedLogs)
    res.render('admin/overview', {
      logs: allLogs,
      foundInternship: foundInternship})
  }catch(err){
    req.flash('error', err.message)
    console.log(err.message)
    res.redirect("/")
  }
})
  
  // Students list page
router.get("/students", middleware.isLoggedInAsAdmin, async function(req, res){
  try{
    let students = await User.find({isAdmin: {$ne: true}});
    let studentList = []
    for(const student of students){
      let applications = await Application.find({author: student._id })
      let keep = true
      for (const app of applications){
        if(app.currentState == 1){
          studentList.push({
            _id: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            foundInternship: true
          })
          keep = false
          break;
        } 
      }
      if(keep){
        studentList.push({
          _id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          foundInternship: false
        })    
      }
    }
    res.render('admin/studentList',{
      students: studentList,
    })
  }catch(err){
    req.flash("error", err.message)
    console.log(err.message)
    res.redirect("/")
  }
})

// Single student page
router.get("/students/:studentID", middleware.isLoggedInAsAdmin, async function(req, res){
  try{
    let student = await User.findById(req.params.studentID)
    let allApplications = await Application.find({author: req.params.studentID}).populate("company").populate("updates").populate("author")
    // Graph 1
    let countApplicationState = {
      _0: 0,
      _1: 0,
      _2: 0
    }
    for (const app of allApplications){
      switch(app.currentState){
        case 0:
          countApplicationState._0++
          break;
        case 1:
          countApplicationState._1++
          break;
        case 2:
          countApplicationState._2++
          break;
      }
    }
    // Graph 2
    let allLogs = createLogs(allApplications)
    res.render("admin/studentOverview", {
      student: student,
      logs: allLogs,
      countApp: countApplicationState
    })
  }catch(err){
    req.flash("error", err.message)
    res.redirect("/admin/students")
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
      res.render("admin/login");
  }
})

// Login logic
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/admin/login',
  failureFlash: "Nom d'utilisateur ou mot de passe invalide."
}), function (req, res) {
  res.redirect(middleware.loginRedirect(req, res))
});

// Register page
router.get("/register", function(req, res){
  res.render("admin/register");
});

// Register logic
router.post("/register", async function (req, res) {
  try{
    if(req.body.tokenAdmin === "testcode123"){
      let inputAdmin = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        isAdmin: true
      });
      let userCreated = await User.register(inputAdmin, req.body.password);
      passport.authenticate("local")(req, res, function () {
        req.flash("success", "Bienvenue " + userCreated.firstName + " " + userCreated.lastName + " !")
        res.redirect("/")
      })
    } else {
      req.flash("error", "Token non valide. Inscription annulée.")
      return res.render("admin/register")
    }
  }catch(err){
    req.flash("error", err.message)
    return res.render("admin/register")
  }
});

module.exports = router;