/** @format */

const User = require("../models/user.js");

module.exports.signupForm = async (req, res) => {
	res.render("users/signup.ejs");
};

module.exports.signupUser = async (req, res, next) => {
	try {
		// console.log(req.body);
		let { username, email, password, cpassword } = req.body;
		if (cpassword !== password) {
			req.flash("error", "Please Enter correct password!");
			res.redirect("/signup");
		}

		let newUser = new User({ username, email });
		let registeredUser = await User.register(newUser, password);
		console.log(registeredUser);

		// signup with login functionality
		req.login(registeredUser, function (err) {
			if (err) {
				return next(err);
			}
			req.flash("success", `Hi ${username}, Welcome to Airbnb!`);
			res.redirect("/listings");
		});
	} catch (err) {
		req.flash("error", err.message);
		res.redirect("/signup");
	}
};

module.exports.loginForm = (req, res) => {
	res.render("users/login.ejs");
};

module.exports.loginUser = async (req, res) => {
	req.flash("success", "Welcome to Airbnb, You are logged in!");
	let { username } = req.body;
	let data = await User.find({ username: username });
	console.log(data);
	// console.log("Login ", req.session.redirectUrl);
	let redirectUrl = res.locals.redirectUrl
		? res.locals.redirectUrl
		: "/listings";
	res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
	req.logOut((err) => {
		if (err) {
			return next(err);
		} else {
			req.flash("success", "You are logged out!");
			res.redirect("/listings");
		}
	});
};
