const express = require("express");
const app = express();

// cookies
const cookie = require("cookie-parser");
app.use(cookie());

app.get("/", (req, res) => {
    console.log("Working on root");
    console.log(req.cookies);
    res.send("Home working");
});

app.get("/getcookie", (req, res) => {
    console.log("Working on getCookie");
    res.cookie("Harsh", "bhot acha h");
    res.cookie("Harshu", "bhot pyara h");
    res.send("Working getCookies!");
});

app.listen(5123, () => {
    console.log("Server working");
})