import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );

  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;

export const ChatState = () => {
  return useContext(ChatContext);
};
