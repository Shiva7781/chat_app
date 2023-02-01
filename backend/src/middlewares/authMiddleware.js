const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

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
