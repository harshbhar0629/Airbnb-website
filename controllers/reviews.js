/** @format */

let Listing = require("../models/listing");
let Review = require("../models/review");

let saveUrl = (req, res) => {
	req.session.redirectUrl = req.originalUrl;
	// console.log(req.originalUrl);
	// console.log(req.session.redirectUrl);
	// why locals because when we logged in bi default passport erase all detail of session
	if (req.session.redirectUrl) {
		res.locals.redirectUrl = req.session.redirectUrl;
	}
};

module.exports.postReview = async (req, res) => {
	// check login
	if (!req.isAuthenticated()) {
		saveUrl(req, res);
		req.flash("error", "You must be logged-in to post review.");
		return res.redirect(`/login`);
	}

	let listing = await Listing.findById(req.params.id);
	// console.log(req.body.review, "hello\n", req.params.id);
	let newReview = new Review(req.body.review);
	newReview.author = req.user._id;
	console.log(newReview);

	listing.reviews.push(newReview);
	await newReview.save();
	await listing.save();

	console.log("New Review saved");
	req.flash("success", "New Review Created!");
	res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res, next) => {
	
	let { id, reviewId } = req.params;
	// check login
	if (!req.isAuthenticated()) {
		saveUrl(req, res);
		req.flash("error", "You must be logged-in to delete review.");
		return res.redirect(`/listings/${id}`);
	}
	console.log("inside");
	let listing = await Listing.findById(id);
	let review = await Review.findById(reviewId);
	// console.log(listing);

	// review can be deleted by its author otherwise deleted by listing owner
	if (
		!review.author.equals(res.locals.currUser._id) &&
		!listing.owner.equals(res.locals.currUser._id)
	) {
		req.flash("error", "You can't delete this Review");
		return res.redirect(`/listings/${id}`);
	}

	await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	await Review.findByIdAndDelete(reviewId);

	if (review.author.equals(res.locals.currUser._id)) {
		req.flash("success", "Review Deleted by its Author!");
	} else {
		req.flash("success", "Review Deleted by listing owner!");
	}

	res.redirect(`/listings/${id}`);
};
