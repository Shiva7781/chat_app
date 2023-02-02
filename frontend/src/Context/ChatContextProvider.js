import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState();

  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;

export const ChatState = () => {
  return useContext(ChatContext);
};
