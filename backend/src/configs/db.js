const mongoose = require("mongoose");
require("dotenv").config();

// DeprecationWarning
mongoose.set("strictQuery", false);

module.exports = async () => {
  return mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("DB connected!");
    })
    .catch((err) => {
      console.log("DB err:", err.message);
    });
};
