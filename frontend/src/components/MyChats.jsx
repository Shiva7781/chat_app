import React, { memo, useEffect, useState } from "react";
import axios from "axios";

import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatContextProvider";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./GroupChatModal";
import { AddIcon } from "@chakra-ui/icons";
import { getSenderName, getSenderPic } from "../config/ChatLogics";
import { baseUrl } from "../config/Api";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  // console.log("chats:", chats);

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);

    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.accessToken}`,
        },
      };
      const { data } = await axios.get(`${baseUrl}/chat`, config);
      setChats(data);

      // console.log("data:", data);
    } catch (err) {
      console.log("err:", err);

      toast({
        title: "Error Occured!",
        description: err.response?.data || err.message,
        status: "error",
        duration: 3210,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();

    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "30%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        w="100%"
        pb={3}
        px={1}
        fontSize={{ base: "28px", md: "2.5rem" }}
        fontFamily="Work sans"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                _hover={{
                  background: "#38B2AC",
                  color: "white",
                }}
                bg={selectedChat === chat ? "coral" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                display="flex"
                alignItems="center"
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="md"
                  cursor="pointer"
                  src={
                    chat.isGroupChat
                      ? chat.groupAdmin.pic
                      : getSenderPic(loggedUser, chat.users)
                  }
                />

                <Box>
                  <Text>
                    {!chat.isGroupChat
                      ? getSenderName(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default memo(MyChats);
