const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("req.headers:", req.headers);

  if (!authHeader) return res.status(401).json("Token Not Found");

  try {
    const token = authHeader.split(" ")[1];
    // console.log("token:", token);

    //decodes token id
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log("Authorization:", decoded);

    if (!decoded) return res.status(403).json("Token is not valid");

    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = { protect };
