import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatContextProvider";
import SideDrawer from "./SideDrawer";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";

const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

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
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
      ;
    </div>
  );
};

export default Chat;
