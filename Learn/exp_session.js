/** @format */

const express = require("express");
const app = express();
const flash = require("connect-flash");

// session
const session = require("express-session");
app.use(
	session({
		secret: "mySuperSecretString",
		resave: false,
		saveUninitialized: true,
	})
);

app.use(flash());

app.get("/count", (req, res) => {
    if (req.session.count) {
        req.session.count++;
    }
    else {
        req.session.count = 1;
    }
    // req.session.count = 1;
    res.send(`You sent the request ${req.session.count} times`);
});

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    console.log(req.session);
    req.flash("success", "user Register successfully"); //key value pair
    res.send(name);
})

app.get("/hello", (req, res) => {
    res.send(`Hello ${req.session.name}`);
})

app.get("/", (req, res) => {
	console.log("Home page");
	res.send("Server working");
});

app.get("/test", (req, res) => {
    console.log("Test");
    let msg = req.flash("success");
	res.send("Test Done");
});

app.listen(3000, () => {
	console.log("Server started");
});
