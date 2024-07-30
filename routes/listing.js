/** @format */

const express = require("express");
const Router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { validateListing } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// controllers
const {
	index,
	getNewListing,
	postNewListing,
	showListing,
	getEditListing,
	updateListing,
	deleteListing,
} = require("../controllers/listings.js");

// show all data
Router.route("/")
	.get(wrapAsync(index)) //show all routes
	.post(
		upload.single("listing[image]"),
		validateListing,
		wrapAsync(postNewListing)
	); //post new listing

// create new route
Router.get("/new", getNewListing);

Router.route("/:id")
	.get(wrapAsync(showListing))
	.put(
		upload.single("listing[image]"),
		validateListing,
		wrapAsync(updateListing)
	)
	.delete(wrapAsync(deleteListing));

Router.get("/:id/edit", wrapAsync(getEditListing));

module.exports = Router;
