const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { protect } = require("../middlewares/authMiddleware");

// register
router.post("/", async (req, res) => {
  let { name, email, password, pic, isAdmin } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(420).json("All fields required");
    }

    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(409).json("Email already registered!");

    // Creating a new mongoose doc with hashed password
    const newUser = new User({
      name,
      email,
      pic,
      isAdmin,
      password: bcrypt.hashSync(password, 11),
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  try {
    if (!user) return res.status(401).json("User does not exist");

    // checking user password with hashed password stored in the database
    const validPassword = bcrypt.compareSync(req.body.password, user.password);
    // console.log(validPassword);

    if (!validPassword) return res.status(401).json("Wrong Username/Password");

    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "26d" }
    );

    // sending JWT with user data except password
    const { password, ...others } = user._doc;
    res.status(200).json({ accessToken, ...others });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// get users with Authorization
router.get("/", protect, async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  // console.log("keyword:", keyword);
  // console.log("req.user:", req.user);

  // Getting all users except current user
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.status(200).send(users);
});

module.exports = router;
