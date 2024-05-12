const express = require("express"); // importing the express package
const authrouter = require("./Routes/authRouter"); // importing the authentication routes
const addsaleRouter = require("./Routes/addsaleRouter"); // importing the routes for sales
const cors = require("cors"); // importing cors to allow cross-origin sharing
const app = express();
app.use(cors()); // using the cors middleware

app.use(express.json()); // using the express.json middleware to parse the request body

app.use("/api/v1/sales/user", authrouter); // applying the authrouter middleware to the given route
app.use("/api/v1/sales", addsaleRouter); // applying the addsaleRouter middleware to the given route
module.exports = app; // exporting the app module
