const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

// to see if frontend and backend are connected
app.get("/check", async (req, res) => {
  return res.send("success!");
});

module.exports = app;
