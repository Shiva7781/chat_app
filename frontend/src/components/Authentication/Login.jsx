import React, { memo, useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/Api";
import { ChatState } from "../../Context/ChatContextProvider";

const Login = () => {
  const { setUser } = ChatState();
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  // console.log("userData:", userData);

  const handlePassword = () => setShow(!show);
  const handleInput = (e) => {
    const { name, value } = e.target;

    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!userData.email || !userData.password) {
      toast({
        title: "All fields required",
        status: "warning",
        duration: 4321,
        isClosable: true,
        position: "top",
      });
      return setLoading(false);
    }

    try {
      const { data } = await axios.post(`${baseUrl}/user/login`, userData);

      console.log("data:", data);

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);
      toast({
        title: "Login Successful",
        status: "success",
        duration: 4321,
        isClosable: true,
        position: "top",
      });

      setTimeout(() => {
        navigate("/chats");
      }, 3456);
    } catch (err) {
      setLoading(false);

      // console.log("err:", err);
      toast({
        title: "Login Failed",
        description: err.response?.data || err.message,
        status: "warning",
        duration: 4321,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          type="email"
          p={1.5}
          placeholder="Enter Your Email"
          disabled={loading}
          onChange={handleInput}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            name="password"
            p={1.5}
            type={show ? "text" : "password"}
            placeholder="Create Password"
            disabled={loading}
            onChange={handleInput}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handlePassword}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
        isLoading={loading}
      >
        Login
      </Button>
    </VStack>
  );
};

export default memo(Login);
