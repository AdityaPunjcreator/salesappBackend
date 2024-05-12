const UserModal = require("../Modals/userModal"); // importing the usermodal
const jwt = require("jsonwebtoken"); // importing the jasonwebtoken module

// in the below code we are basically creating a jwt
const generateToken = (id) => {
  return jwt.sign({ id: id }, process.env.SECRET_STRING, {
    expiresIn: process.env.LOGIN_EXPIRES,
  }); // using the sign method to generate a jwt, passing id in the payload and secret string is coming from environment files
};
// creating the signUp route handler function
const signUp = async (request, response) => {
  try {
    const { firstname, lastname, email, password, confirmPassword } =
      request.body; // destructuring the request body to get firstname, lastname, email, password, confirmPassword
    // checking if firstname, lastname, email, password, confirmPassword is present or not
    if (!firstname || !lastname || !email || !password || !confirmPassword) {
      return response.status(400).json({
        error: "One or more fields are missing",
      });
    }
    // checking if a user exists or not in the database
    const existingUser = await UserModal.findOne({ email: email });

    if (existingUser) {
      return response
        .status(400)
        .json({ error: "User already exists! Kindly login" });
    }
    // finally after all those checks are done creating a user in the database
    const newUser = await UserModal.create(request.body);

    return response
      .status(201)
      .json({ message: "User created successfully", newUser });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
};

// creating the login event handler function
const login = async (request, response) => {
  const { email, password } = request.body; // destructuring the request body to get email and password
  // checking if the user has entered the email and password or not
  try {
    // checking if the email and password is present or not
    if (!email || !password) {
      return response
        .status(400)
        .json({ error: "one or other fields are missing" });
    }

    // now we are checking whether the user with that credential exists in our database or not
    const user = await UserModal.findOne({ email: email }).select("+password");

    //  we will be also checking if the password entered matches to the password in our database, for that we already created an instance method(in the userModal.js) which will be available on the collection

    if (!user || !(await user.comparepassword(password, user.password))) {
      return response.status(400).json({ error: "invalid credentials" });
    }
    //if everything is okay, then we will sending the user a JWT token
    const token = generateToken(user._id);
    return response
      .status(200)
      .json({ message: "login successful", token, user });
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
};

const protect = async (request, response, next) => {
  // checking if there is token or not
  try {
    console.log(request.headers.authorization);
    const { authorization } = request.headers;
    if (!authorization) {
      return response.status(401).json({ error: "user is not logged in " });
    }
    // if it exists then in below code we are writing the logic to retreive the token

    const token = authorization.split(" ")[1];
    console.log(token); // checking the token which i am receiving

    // checking if the token is valid or not
    jwt.verify(token, process.env.SECRET_STRING, async (err, decodedToken) => {
      if (err) {
        return response.status(401).json({
          error: "invalid token",
        });
      }

      const { id } = decodedToken; // destructuring the id

      // now we are checking  if the user exist in our database or not with the help of id we received
      const user = await UserModal.findById(id);
      if (user) {
        request.user = user;
        next(); // allow user to access route
      } else {
        return response.send(400).json({ error: "Invalid user" });
      }
    });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
};

module.exports = { signUp, login, protect };
