const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types; // passing  the reference to create one to many relationships

const addSaleSchema = new mongoose.Schema({
  productname: {
    type: String, // the data type  is string
    trim: true, // setting trim to true to remove any whitespace in the start
    required: [true, "product name is required"], // it is a required field
  },
  quantity: {
    type: Number,
    required: [true, "quantity is required"],
  },
  price: {
    type: Number,
    required: [true, "price is required"],
  },
  createdOn: {
    type: String,
    default: new Date().toLocaleDateString(),
    // setting the default value of createdOn field to this, here i am created current date date
    select: false, // this field will not be sent to the user
  },
  author: {
    type: ObjectId,
    ref: "userCollections", // passing the reference of the usercollections
  },
});

const AddSaleModal = mongoose.model("AddSaleCollections", addSaleSchema);

module.exports = AddSaleModal;
