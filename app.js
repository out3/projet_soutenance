// Setup packages
const express               = require("express"),
      app                   = express(),
      bodyParser            = require("body-parser"),
      mongoose              = require("mongoose"),
      passport              = require("passport"),
      LocalStrategy         = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose"),
      methodOverride        = require("method-override"),
      flash                 = require("connect-flash");

// Import models
const User                  = require("./models/user"),
      Application           = require("./models/application"),
      Update                = require("./models/update"),
      Company               = require("./models/company"),
      Contact               = require("./models/contact");

// Import Routes
const indexRoutes           = require("./routes/index"),
      companiesRoutes       = require("./routes/companies"),
      contactsRoutes        = require("./routes/contacts"),
      applicationRoutes     = require("./routes/applications"),
      updateRoutes          = require("./routes/updates"),
      adminRoutes           = require("./routes/admin");

// Setup Express
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Setup mongoose
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

// Passport configuration
app.use(require("express-session")({
  secret: "Paraphrase test",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global variables (available in every page)
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
})

// Express routes
app.use("/", indexRoutes);
app.use("/companies", companiesRoutes);
app.use("/companies", contactsRoutes);
app.use("/applications", applicationRoutes);
app.use("/applications", updateRoutes);
app.use("/admin", adminRoutes);

// Launch Server on Port 8080
app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server has started on " + process.env.IP + ":" + process.env.PORT)
})