import React, { useState } from "react";
import axios from "axios";

import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../Context/ChatContextProvider";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";
import ChatLoading from "./ChatLoading";
import { baseUrl } from "../config/Api";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, chats, setChats } = ChatState();

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

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
        position: "top",
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      return toast({
        title: "User already added",
        status: "warning",
        duration: 4321,
        isClosable: true,
        position: "top",
      });
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.accessToken}`,
        },
      };
      const { data } = await axios.post(
        `${baseUrl}/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 4321,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      console.log("err:", err);

      toast({
        title: "Failed to Create the Chat!",
        description: err.response?.data || err.message,
        status: "error",
        duration: 4321,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Shiva"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult
                ?.slice(0, 5)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
