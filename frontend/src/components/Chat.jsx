import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "../Context/ChatContextProvider";
import SideDrawer from "./SideDrawer";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";

const Chat = () => {
  const { user } = ChatState();

  // useEffect(() => {
  //   const fetchChats = async () => {
  //     try {
  //       const { data } = await axios.get(`http://localhost:7781/api/chat`);

  //       setChats(data);
  //       // console.log("data:", data);
  //     } catch (err) {
  //       console.log("err:", err);
  //     }
  //   };
  //   fetchChats();
  // }, []);

  return (
    <div style={{ width: "100%", color: "black" }}>
      {user && <SideDrawer />}
      <Box
        w="100%"
        h="87vh"
        p="11px"
        display="flex"
        justifyContent="space-between"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
      ;
    </div>
  );
};

export default Chat;
