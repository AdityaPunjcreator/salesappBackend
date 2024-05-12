const express = require("express"); // importing the exprss module
const addSaleController = require("../Controllers/AddSaleController"); // importing the AddSaleController function
const authController = require("../Controllers/authController"); // importing the AuthController function
const addSaleRouter = express.Router(); // creating the addSaleRouter

addSaleRouter.post(
  "/addsales", // this is endpoint for the post request
  authController.protect, // this is the middleware to check whether the user is logged in or not
  addSaleController.addSale // this is the middleware to add the sale in the database
);
addSaleRouter.get(
  "/getsales",
  authController.protect,
  addSaleController.gettopsales
);

addSaleRouter.get(
  "/revenue",
  authController.protect,
  addSaleController.totalrevenue
);

module.exports = addSaleRouter; // exporting the addSaleRouter
