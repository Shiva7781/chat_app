import axios from "axios";
import React, { useState, useEffect } from "react";

const Chat = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get(`http://localhost:7781/api/chat`);

        setChats(data);
        // console.log("data:", data);
      } catch (err) {
        console.log("err:", err);
      }
    };
    fetchChats();
  }, []);

  return (
    <div>
      {chats?.map((chat, i) => {
        const { chatName } = chat;

        return <div key={i}>{chatName}</div>;
      })}
    </div>
  );
};

export default Chat;
