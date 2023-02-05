import React, { memo, useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatContextProvider";
import { getSenderName, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const fetchMessage = async () => {
    if (!selectedChat) return;

    setLoading(true);

    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.accessToken}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:7781/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);

      setLoading(false);
      // console.log("data:", data);
    } catch (err) {
      setLoading(false);

      console.log("err:", err);

      toast({
        title: "Error Occured!",
        description: err.response?.data || err.message,
        status: "error",
        duration: 3210,
        isClosable: true,
        position: "top",
      });
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Contenet-Type": "application/json",
            authorization: `Bearer ${user.accessToken}`,
          },
        };
        const { data } = await axios.post(
          "http://localhost:7781/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        setNewMessage("");

        setMessages([...messages, data]);

        // console.log("data:", data);
      } catch (err) {
        console.log("err:", err);

        toast({
          title: "Error Occured!",
          description: err.response?.data || err.message,
          status: "error",
          duration: 3210,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing Indicator Logic
  };

  useEffect(() => {
    fetchMessage();

    // eslint-disable-next-line
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "2.5rem" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <Avatar
              mt="7px"
              mr={1}
              size="lg"
              cursor="pointer"
              src={
                user.isGroupChat
                  ? user.groupAdmin.pic
                  : user._id !== selectedChat?.users[0]._id
                  ? selectedChat.users[0].pic
                  : selectedChat.users[1].pic
              }
            />

            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSenderName(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessage={fetchMessage}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* Messages Here */}

            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              // Messages
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default memo(SingleChat);
