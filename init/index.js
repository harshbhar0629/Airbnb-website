/** @format */

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require("dotenv").config();

// database setup
async function main() {
	await mongoose.connect(process.env.ATLASDB_URL);
}

main()
	.then(() => {
		console.log("Database connect successfully");
	})
	.catch((err) => {
		console.log("Error in database connection");
	});

const initDb = async () => {
	await Listing.deleteMany({});
	initData.data = initData.data.map((obj) => ({
		...obj,
		owner: "66a1b03f59efbdf6f5e7d417",
	}));
	let data = await Listing.insertMany(initData.data);
	console.log("Intialise data");
};

initDb();

