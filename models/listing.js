const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const def_link = "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

let listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ], 
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

// when we call to app.post for find and delete by id listing called as a middleware it will automatically
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        console.log("Listing middleware called");
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;