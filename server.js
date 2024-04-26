const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const mongoose = require("mongoose");

global.__basedir = __dirname;

mongoose
  .set("strictQuery", false)
  .connect(process.env.MONGODB_SERVER)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err.message, "MongoDB connection Failed"));

app.listen(process.env.PORT || 5000, () =>
  console.log(`Listening to port ${process.env.PORT}`)
);
