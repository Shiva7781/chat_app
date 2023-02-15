import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
  let LS = JSON.parse(localStorage.getItem("userInfo"));
  const [user, setUser] = useState(LS);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState();
  const [notification, setNotification] = useState([]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;

export const ChatState = () => {
  return useContext(ChatContext);
};
