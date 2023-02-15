export const getSenderPic = (loggedUser, users) => {
  // console.log("loggedUser:", loggedUser);
  // console.log("users[1].pic:", users[1].pic);

  return users[0]._id === loggedUser?._id ? users[1].pic : users[0].pic;
};

export const getSenderName = (loggedUser, users) => {
  // console.log("loggedUser:", loggedUser);
  // console.log("users:", users);

  return users[0]._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser?._id ? users[1] : users[0];
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

// For Left Right Chat
export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  // For all messages from othes
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 7;
  // For last message from others with PP
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 3;
  // For sender messages
  else {
    return "auto";
  }
};

// For displaying the sender pic in group chat
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};
