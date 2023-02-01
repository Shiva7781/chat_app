const Chat = require("../models/chat.model");

const authAdmin = async (req, res, next) => {
  try {
    const { chatId } = req.body;
    const { groupAdmin } = await Chat.findById(chatId);

    console.log(req.user._id.toString(), groupAdmin.toString());

    if (req.user._id.toString() !== groupAdmin.toString()) {
      return res.status(403).json("You are not allowed to do this");
    }

    next();
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = { authAdmin };
