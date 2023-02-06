import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatContextProvider";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./UserListItem";
import { baseUrl } from "../config/Api";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessage }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      return toast({
        title: "User Already in group!",
        status: "error",
        duration: 4321,
        isClosable: true,
        position: "top",
      });
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      return toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 4321,
        isClosable: true,
        position: "top",
      });
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          authorization: `Bearer ${user.accessToken}`,
        },
      };
      const { data } = await axios.patch(
        `${baseUrl}/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 4321,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemoveUser = async (user1) => {
    // console.log("selectedChat:", selectedChat, "user:", user, "user1:", user1);

    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      return toast({
        title: "Only admins can Remove someone!",
        status: "error",
        duration: 4321,
        isClosable: true,
        position: "top",
      });
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          authorization: `Bearer ${user.accessToken}`,
        },
      };
      const { data } = await axios.patch(
        `${baseUrl}/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);

      setFetchAgain(!fetchAgain);
      fetchMessage();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 4321,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRename = async () => {
    if (!groupChatName) {
      return toast({
        title: "Please enter new group name",
        status: "warning",
        duration: 4321,
        isClosable: true,
        position: "top",
      });
    }

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          authorization: `Bearer ${user.accessToken}`,
        },
      };
      const { data } = await axios.patch(
        `${baseUrl}/chat/grouprename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);

      // console.log("data:", data);
    } catch (err) {
      setRenameLoading(false);
      console.log("err:", err);

      toast({
        title: "Error Occured!",
        description: err.response?.data || err.message,
        status: "error",
        duration: 4321,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) return;

    try {
      setLoading(true);

      const config = {
        headers: {
          authorization: `Bearer ${user.accessToken}`,
        },
      };
      const { data } = await axios.get(
        `${baseUrl}/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);

      //   console.log("data:", data);
    } catch (err) {
      setLoading(false);
      console.log("err:", err);

      toast({
        title: "Error Occured!",
        description: err.response?.data || err.message,
        status: "error",
        duration: 4321,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontSize="33px"
            fontFamily="work sans"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemoveUser(u)}
                />
              ))}
            </Box>

            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add User"
                m={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemoveUser(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
