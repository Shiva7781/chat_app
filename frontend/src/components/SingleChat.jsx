import React, { memo, useEffect, useRef, useState } from "react";
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
import { baseUrl } from "../config/Api";
import Lottie from "react-lottie";
import TypingAnimation from "../animation/typing.json";

//
import io from "socket.io-client";
const ENDPOINT = "https://chat-app-be-273q.onrender.com/";

//
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  let socket = useRef();
  let selectedChatCompare = useRef();
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: TypingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io(ENDPOINT);
    socket.current.emit("setup", user);
    socket.current.on("connected", () => setSocketConnected(true));
    socket.current.on("typing", () => setIsTyping(true));
    socket.current.on("stop_typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessage();

    selectedChatCompare.current = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  useEffect(() => {
    socket.current.on("message_received", (newMessageReceived) => {
      if (
        !selectedChatCompare.current || // if chat is not selected or doesn't match current chat
        selectedChatCompare.current._id !== newMessageReceived.chat._id
      ) {
        // give notification

        if (!notification.includes(newMessageReceived)) {
          setNotification([...notification, newMessageReceived]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

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
        `${baseUrl}/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
      // console.log("data:", data);

      socket.current.emit("join_chat", selectedChat._id);
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
    // console.log("msg:", msg);

    setNewMessage(msg);

    // Typing Indicator Logic
    if (!socketConnected) return;

    if (msg) {
      console.log("msg:", msg);

      socket.current.emit("typing", selectedChat._id);
    }

    setTimeout(() => {
      socket.current.emit("stop_typing", selectedChat._id);
    }, 2773);
  };

  const sendMessage = async () => {
    socket.current.emit("stop_typing", selectedChat._id);

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
        `${baseUrl}/message`,
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        config
      );

      setMessages([...messages, data]);
      setNewMessage("");
      // console.log("data:", data);

      socket.current.emit("new_message", data);
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
                <ScrollableChat
                  messages={messages}
                  selectedChatIsGroupChat={selectedChat.isGroupChat}
                />
              </div>
            )}

            {isTyping ? (
              <div>
                <Lottie
                  options={defaultOptions}
                  width={77}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                />
              </div>
            ) : null}
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
