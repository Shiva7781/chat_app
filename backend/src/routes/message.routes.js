const router = require("express").Router();
const Message = require("../models/message.model");
const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const { protect } = require("../middlewares/authMiddleware");

// sendMessages
router.post("/", protect, async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.status(200).json(message);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

// allMessages
router.get("/:chatId", protect, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.status(200).json(messages);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

module.exports = router;
