const express = require("express"); // importing the express module
const authcontroller = require("../Controllers/authController"); // importing the  auth controller functions
const authrouter = express.Router(); // creating the routes with the help of Router method

authrouter.post("/registration", authcontroller.signUp); // using the "signUp" controller function as the property of the exported object when the endpoint is "/registration"
authrouter.post("/login", authcontroller.login);

module.exports = authrouter; // exporting the authrouter module
