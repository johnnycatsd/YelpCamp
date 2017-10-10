var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash      = require("connect-flash"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds");
    
    //requiring routes
    var commentRoutes    = require("./routes/comments"),
        campgroundRoutes = require("./routes/campgrounds"),
        indexRoutes      = require("./routes/index");
        
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v12";

mongoose.connect(url, {useMongoClient: true});
//mongoose.connect("mongodb://john:rusty@ds113785.mlab.com:13785/yelpcamp_jm", {useMongoClient: true});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
mongoose.Promise = global.Promise;
//seedDB(); //seed the DB

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Tater Tots are very tasty and delicious!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server Has Started"); 
    
});

// RESTFUL ROUTES

// name      url      verb    desc.
// ===============================================
// INDEX   /dogs      GET   Display a list of all dog
// NEW     /dogs/new  GET   Displays form to make a new dog
// CREATE  /dogs      POST  Add new dog to DB
// SHOW    /dogs/:id  GET   Shows info about one dog