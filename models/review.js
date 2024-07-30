// implementing 1 to n relationship means one post have multiple reviews
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

let Review = mongoose.model("Review", reviewSchema);
module.exports = Review;