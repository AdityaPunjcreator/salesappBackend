const mongoose = require("mongoose"); // importing mongoose library
const validator = require("validator"); // importing validator library for setting up validation in modal
const bcrypt = require("bcryptjs"); // using bcrypt to encrypt the password while storing in the database

// creating a user Schema using mongoose schema method
const userSchema = new mongoose.Schema({
  firstname: {
    type: String, // setting the type as String
    required: [true, "firstname is a required field"], // making this as a required field
    minlength: 2, // setting minimum length to 2
    trim: true, // setting trim to true so that there is no whitespace at the start
  },
  lastname: {
    type: String,
    required: [true, "lastname is a required field"],
    trim: true,
  },
  email: {
    type: String,
    unique: true, // setting this field to true so that the email is unique and no duplicate email is stored in the database
    required: true, // it is a required field
    lowercase: true,
    validate: [validator.isEmail, "please enter a valid email"], // setting validation using "validator" module
  },
  password: {
    type: String,
    required: [true, "The password must have 8 characters"],
    minlength: 8, // setting the minimum length of the password to 8 characters
    select: false, // by setting this to false, ensuring that the password field is not sent to the client
  },
  createdOn: {
    type: String, // settting the type of the field as String
    default: new Date().toLocaleDateString(), // setting the default value
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "confirm password is a required field"],
    validate: {
      validator: function (value) {
        return value === this.password;
      }, // setting up custom validation, to check whether the confirm password matches to the password field or not
      message: "password and confirm password does not match",
    },
  },
});

/* using the mongoose pre save middleware , hasing the password before saving it also keeping in mind that
 we only hash the password if it is modified or created for the first time*/
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined; // in the database the confirmPassword will not be stored
});

// creating an instance method to compare the password
userSchema.methods.comparepassword = async function (userpwd, pwdindb) {
  return await bcrypt.compare(String(userpwd), pwdindb);
};

const UserModal = mongoose.model("userCollections", userSchema);

module.exports = UserModal;
