const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");
const messageRoutes = require("./routes/message.routes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// to see if frontend and backend are connected
app.get("/check", async (req, res) => {
  return res.send("success!");
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
