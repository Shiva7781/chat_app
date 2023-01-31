const mongoose = require("mongoose");

const chatShcema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },

    isGroupChat: { type: Boolean, default: false },

    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },

    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },

  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Chat", chatShcema);
