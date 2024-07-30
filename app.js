/** @format */
// environment variables
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

// Require portion
const express = require("express");
const app = express();
const path = require("path");

// Npm packages
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const db_url = process.env.ATLASDB_URL;

// Error
const ExpressError = require("./utils/ExpressError.js");

//  Models
const User = require("./models/user.js");

// Router
const userRouter = require("./routes/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");

// ejs-mate
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

// method override
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo");
app.use(methodOverride("_method"));

// Express settings
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // to read the data or parsing the data
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
	mongoUrl: db_url,
	crypto: {
		secret: process.env.SECRET,
	},
	touchAfter: 24 * 60 * 60,
});

store.on("error", () => {
	console.log("Error in mongo session store: ");
})

const sessionOpt = {
	store,
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //7 days 24hr 60min 60sec 1000msec
		maxAge: 7 * 24 * 60 * 60 * 1000,
		httpOnly: true,
	},
};

// database setup
async function main() {
	// await mongoose.connect("mongodb://127.0.0.1:27017/Airbnb");
	await mongoose.connect(db_url);
}

// Server start
app.listen(3000, () => {
	console.log("Server started at port 3000");
});

// home route
app.get("/", (req, res) => {
	res.redirect("/listings");
});



// session and flash
app.use(session(sessionOpt));
app.use(flash());

// implementing passport , passport locals
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// implementing flash
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.currUser = req.user;
	next();
});

// Routes which start from "/listings/..." when it render in url then it call to its path which is written inside review.js
app.use("/listings", listingsRouter);

// Routes which start from "/listings/:id/reviews/..." when it render in url then it call to its path which is written inside review.js
app.use("/listings/:id/reviews", reviewsRouter);

// user
app.use("/", userRouter);

main()
	.then(() => {
		console.log("Database connect successfully");
	})
	.catch((err) => {
		console.log("Error in database connection");
	});

// Error handling to client side

app.all("*", (req, res, next) => {
	next(new ExpressError("NOT FOUND!", "404"));
});

app.use((err, req, res, next) => {
	let { statusCode = 500, message = "Something went wring!" } = err;
	let error = {
		statusCode: statusCode,
		message: message,
	};
	// res.status(statusCode).send(message);
	res.render("./listings/error.ejs", { error });
});
