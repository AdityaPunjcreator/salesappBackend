const env = require("dotenv"); // importing the environment file(config file)
env.config({ path: "./config.env" }); // passing the path to the config file
const app = require("./app"); // importing the app file containing the express
const mongoose = require("mongoose"); // importing the mongoose package
// creating a connection with the mongoDB atlas database(cloud)
mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection established");
  })
  .catch((err) => {
    console.log(err);
  });

// creating and starting the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("listening on port ", port);
});
