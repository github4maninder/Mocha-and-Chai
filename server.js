//=======================================================
// Project:         Mocha & Chai
//
// Author:          Karolina, Srimantika and Maninder
// Submitted:       November 26, 2021
// Organization:    Lighthouse Labs
//
//=======================================================
//                 SERVER SETUP
//=======================================================

// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const loginRoutes = require("./routes/login");
const orderPageRoutes = require("./routes/orderPage");
const prepTimeRoutes = require("./routes/prepTime");
const resturantPageRoutes = require("./routes/resturantPage");
// const usersRoutes = require("./routes/users");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/login", loginRoutes(db));
app.use("/orderPage", orderPageRoutes(db));
app.use("/prepTime/", prepTimeRoutes(db));
app.use("/resturantPage", resturantPageRoutes(db));
// app.use("/api/users", usersRoutes(db));

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

//=======================================================
//                  GET REQUESTS
//=======================================================

app.get("/", (req, res) => {
  const templeVars = { MAPS_API: process.env.MAPS_API };
  res.render("index", templeVars);
});

app.listen(PORT, () => {
  console.log(`Mocha & Chai ☕️ Server listening on port ${PORT}`);
});

//=======================================================
//              -  MAJOR RELEASE 1.0 -
//=======================================================

//=======================================================
//=======================================================
//                      END
//=======================================================
//=======================================================
