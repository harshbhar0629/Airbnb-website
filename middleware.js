/** @format */
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

// check validation listing
module.exports.validateListing = (req, res, next) => {
	// Validation handling
	let { error } = listingSchema.validate(req.body);
	// console.log(result);

	if (error) {
		let errMsg = error.details.map((e) => e.message).join(" , ");
		throw new ExpressError(errMsg, 400);
	} else {
		next();
	}
};

// check validation Review
module.exports.validateReview = (req, res, next) => {
	// Validation handling
	let { error } = reviewSchema.validate(req.body);
	// console.log(result);

	if (error) {
		let errMsg = error.details.map((e) => e.message).join(" , ");
		throw new ExpressError(errMsg, 400);
	} else {
		next();
	}
};

module.exports.saveRedirectUrl = (req, res, next) => {
	if (req.session.redirectUrl) {
		res.locals.redirectUrl = req.session.redirectUrl;
	}
	next();
};


