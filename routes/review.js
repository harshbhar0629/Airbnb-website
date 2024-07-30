/** @format */

const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validateReview } = require("../middleware.js");

// controllers
const { postReview, deleteReview } = require("../controllers/reviews.js");


// Reviews for listing
// post route
router.post(
	"/",
	validateReview,
	wrapAsync(postReview)
);

// Delete review based on id
router.delete("/:reviewId", wrapAsync(deleteReview));

module.exports = router;
