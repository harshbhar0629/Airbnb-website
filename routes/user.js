/** @format */

const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const {
	signupForm,
	signupUser,
	loginForm,
	loginUser,
	logoutUser,
} = require("../controllers/users.js");

// sign up
router.route("/signup").get(signupForm).post(wrapAsync(signupUser));

// login
router
	.route("/login")
	.get(loginForm)
	.post(
		
		saveRedirectUrl,
		passport.authenticate("local", {
			failureRedirect: "/login",
			failureFlash: true,
		}),
		loginUser
	);

// logout
router.get("/logout", logoutUser);

module.exports = router;
