import React, { useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import NotificationBadge, { Effect } from "react-notification-badge";
import { Search2Icon, BellIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatContextProvider";
import ProfileModal from "./ProfileModal";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../config/Api";
import { getSenderName } from "../config/ChatLogics";

const SideDrawer = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const {
    user,
    setUser,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");

    setUser(null);
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      return toast({
        title: "All fields required",
        status: "warning",
        duration: 4321,
        isClosable: true,
        position: "top-left",
      });
    }

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
    } catch (err) {
      setLoading(false);
      console.log("err:", err);

      toast({
        title: "Failed to Load the search Results",
        description: err.response?.data || err.message,
        status: "warning",
        duration: 4321,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const accessChat = async (userId) => {
    // console.log("userId:", userId);

    setLoadingChat(true);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${user.accessToken}`,
        },
      };

      const { data } = await axios.post(`${baseUrl}/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();

      // console.log("data", data);
    } catch (err) {
      setLoadingChat(false);
      console.log("err:", err);

      toast({
        title: "Error Occured!",
        description: err.response?.data || err.message,
        status: "warning",
        duration: 4321,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="4px 7px 4px 7px"
        borderWidth="5px 0px 5px 0px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen} ref={btnRef}>
            <Search2Icon boxSize={5} />
            <Text display={{ base: "none", md: "flex" }} px="3">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="3xl" fontFamily="Work sans">
          Let's Chat
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />

              <BellIcon m={1} boxSize={6} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length
                ? "No new Messages"
                : notification.map((noti, i) => (
                    <MenuItem
                      key={i}
                      onClick={() => {
                        setSelectedChat(noti.chat);
                        setNotification(notification.filter((n) => n !== noti));
                      }}
                    >
                      {noti.chat.isGroupChat
                        ? `New Messaage in ${noti.chat.chatName}`
                        : `New Message from ${getSenderName(
                            user,
                            noti.chat.users
                          )}`}
                    </MenuItem>
                  ))}
            </MenuList>
          </Menu>
          <Menu m={5}>
            <MenuButton as="button">
              <Avatar size="sm" name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        placement="left"
        onClose={onClose}
        isOpen={isOpen}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}

            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
