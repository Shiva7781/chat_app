const express = require("express");
const app = express();
const cors = require("cors");
const { chats } = require("../dummyData");

app.use(express.json());
app.use(cors());

const userRoutes = require("./routes/user.routes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

app.use("/api/user", userRoutes);

// to see if frontend and backend are connected
app.get("/check", async (req, res) => {
  return res.send("success!");
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
