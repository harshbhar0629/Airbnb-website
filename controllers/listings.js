/** @format */

const Listing = require("../models/listing.js");

let saveUrl = (req, res) => {
	req.session.redirectUrl = req.originalUrl;
	// console.log(req.originalUrl);
	// console.log(req.session.redirectUrl);
	// why locals because when we logged in bi default passport erase all detail of session
	if (req.session.redirectUrl) {
		res.locals.redirectUrl = req.session.redirectUrl;
	}
};

module.exports.index = async (req, res) => {
	let allData = await Listing.find({})
		.populate({
			path: "reviews",
			populate: {
				path: "author",
			},
		})
		.populate("owner");
	// console.log(allData);
	res.render("./listings/index.ejs", { allData });
};

module.exports.getNewListing = (req, res) => {
	if (!req.isAuthenticated()) {
		saveUrl(req, res);

		req.flash("error", "You must be logged-in to create listing.");
		return res.redirect("/login");
	}
	console.log("Inside new route", req.isAuthenticated());

	res.render("./listings/new.ejs");
};

module.exports.postNewListing = async (req, res, next) => {
	// if (!req.body.listing) {
	//     throw new ExpressError("Bad Request!\nSend Valid Data for Listing", 400);
	// }
	if (!req.isAuthenticated()) {
		saveUrl(req, res);

		req.flash("error", "You must be logged-in to create listing.");
		return res.redirect("/login");
	}
	let url = req.file.path;
	let filename = req.file.filename;
	let { listing } = req.body;
	// console.log(listing);
	let list = new Listing(listing);
	// access owner
	list.owner = req.user._id;
	list.image = { url, filename };

	await list.save();
	req.flash("success", "New Listing Created!");
	res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
	let { id } = req.params;
	console.log(id);
	// nested populate
	let data = await Listing.findById(id)
		.populate({
			path: "reviews",
			populate: {
				path: "author",
			},
		})
		.populate("owner");
	console.log(data);
	if (!data) {
		req.flash("error", "Listing you requested for doesn't exist!");
		res.redirect("/listings");
	}
	console.log(data);
	saveUrl(req, res);

	res.render("./listings/show.ejs", { data });
};

module.exports.getEditListing = async (req, res) => {
	let { id } = req.params;
	if (!req.isAuthenticated()) {
		saveUrl(req, res);

		req.flash("error", "You must be logged-in to edit listing.");
		return res.redirect(`/login`);
	}

	let listing = await Listing.findById(id);
	if (!listing.owner._id.equals(res.locals.currUser._id)) {
		req.flash("error", "You don't have permission to edit this listing");
		return res.redirect(`/listings/${id}`);
	}

	// console.log(listing.description);
	if (!listing) {
		req.flash("error", "Listing you requested for doesn't exist!");
		res.redirect("/listings");
	}
	res.render("./listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
	let { id } = req.params;
	// check login
	if (!req.isAuthenticated()) {
		saveUrl(req, res);

		req.flash("error", "You must be logged-in to edit listing.");
		return res.redirect(`/login`);
	}

	// handle authorization for hopscoth postman they can edit my listing without login handle that specific problem
	let listing = await Listing.findById(id);
	if (listing.owner._id.equals(res.locals.currUser._id)) {
		let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

		if (typeof req.file !== "undefined") {
			let url = req.file.path;
			let filename = req.file.filename;
			listing.image = { url, filename };
			await listing.save();
		}

		req.flash("success", "Listing Updated!");
	} else {
		req.flash("error", "You don't have permission to edit this listing");
	}

	res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
	let { id } = req.params;

	if (!req.isAuthenticated()) {
		saveUrl(req, res);

		req.flash("error", "You must be logged-in to delete listing.");
		return res.redirect(`/login`);
	}

	let listing = await Listing.findById(id);
	if (!listing.owner._id.equals(res.locals.currUser._id)) {
		req.flash("error", "You don't have permission to delete this listing");
		return res.redirect(`/listings/${id}`);
	}

	console.log("Inside delete route");

	let l = await Listing.findByIdAndDelete(id);
	console.log(l);
	req.flash("success", "Listing Deleted!");
	res.redirect("/listings");
};
