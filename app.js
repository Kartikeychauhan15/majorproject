if(process.env.NODE_ENV != "production"){
   require("dotenv").config();
}

// console.log(process.env);


const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("../models/listing.js");
//const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
//const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema,reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// const MONGO_URL = "mongodb://127.0.0.1:27017/kartik";

const dbUrl = process.env.ATLASDB_URL;

console.log("MongoDB URL:", dbUrl);
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
    socketTimeoutMS: 45000, // Increase socket timeout
};

async function main() {
    try {
        await mongoose.connect(dbUrl, mongooseOptions);
        console.log("Connected to DB");
    } catch (err) {
        console.error("DB connection error:", err);
    }
}


main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret : process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", ()=>{
    console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOptions = {
    store,
    secret :  process.env.SECRET,
    resavve: false,
    saveInitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly :true
    },
};



// app.get("/", (req, res) => {
//     res.send("Hi I am root");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let FakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });
//     let registerUser = await User.register(FakeUser, "helloworld");
//     res.send(registerUser);
// });



app.use("/listings",listingRouter); 
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);



// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "by the beach",
//         price: 1200,
//         location: "Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("succesfull testing ");
// });

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
})

app.use((err, req, res, next) => {
    console.error(err); // Log the error details
    let { statusCode, message } = err;
    res.status(statusCode).render("error.ejs", { message });
//     const status = err.status || 500;
//   res.status(status);
    // res.status(statusCode=505).send(message="Something went Wrong!");
    // res.send("Something went wrong!");
});

app.listen(8080, () => {
    console.log("server is listening to port 8080 ");
}); 