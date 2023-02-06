import React, { memo, useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  IconButton,
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
import InputEmoji from "react-input-emoji";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetchMessage();

    // eslint-disable-next-line
  }, [selectedChat]);

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

  const typingHandler = (msg) => {
    console.log("msg:", msg);

    setNewMessage(msg);
    // Typing Indicator Logic
  };

  const sendMessage = async () => {
    if (!newMessage) {
      return toast({
        title: "Type some message",
        description: "Input Message Not Found",
        status: "warning",
        duration: 4321,
        isClosable: true,
        position: "top",
      });
    }

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

      setMessages([...messages, data]);
      setNewMessage("");

      // console.log("data:", data);
    } catch (err) {
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

  // console.log("user:", user);
  // console.log("selectedChat:", selectedChat);

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "2.5rem" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="md"
                    cursor="pointer"
                    src={
                      user._id !== selectedChat.users[0]._id
                        ? selectedChat.users[0]?.pic
                        : selectedChat.users[1]?.pic
                    }
                  />
                  <Text>{getSenderName(user, selectedChat.users)}</Text>
                </Box>

                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="md"
                    cursor="pointer"
                    src={selectedChat.groupAdmin?.pic}
                  />
                  <Text>{selectedChat.chatName.toUpperCase()}</Text>
                </Box>

                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessage={fetchMessage}
                />
              </>
            )}
          </Box>

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
              <div className="Messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            {/* Sender */}
            <div className="Sender" mt={3}>
              <InputEmoji
                value={newMessage}
                onChange={typingHandler}
                onEnter={sendMessage}
                cleanOnEnter
              />
              <button className="send_button" onClick={sendMessage}>
                Send
              </button>
            </div>
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
