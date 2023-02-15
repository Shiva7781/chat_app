const app = require("./index");
const connectDB = require("./configs/db");
require("dotenv").config();

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  connectDB();
  console.log(
    `Backend server is runnig on http://localhost:${port} DB connecting...`
  );
});

// ---------------socket.io-----------------
const io = require("socket.io")(server, {
  pingTimeout: 54321,

  cors: {
    origin: ["https://chat-app-shiva7781.netlify.app", "http://localhost:3000"],
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log("userData:", userData?._id);
    socket.emit("connected");
  });

  socket.on("join_chat", (room) => {
    socket.join(room);
    console.log("User Joined Room:" + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop_typing", (room) => socket.in(room).emit("stop_typing"));

  socket.on("new_message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message_received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
