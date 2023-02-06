import React, { memo, useState } from "react";
import {
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../config/Api";

const Signup = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // console.log("userData:", userData);

  const handlePassword = () => setShow(!show);
  const handleInput = (e) => {
    const { name, value } = e.target;

    setUserData({ ...userData, [name]: value });
  };

  const handleProfile = async (imageFile) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "chat_app");

    try {
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/shiva7781/image/upload`,
        formData
      );

      userData.pic = data.secure_url;
      setUserData({ ...userData });
      setLoading(false);

      // console.log("data:", data);
      // console.log("userData:", userData);
    } catch (err) {
      setLoading(false);

      console.log("err:", err.message);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (userData.password !== userData.confirmPassword) {
      toast({
        title: "Password not matching",
        status: "warning",
        duration: 4321,
        isClosable: true,
        position: "top",
      });
      return setLoading(false);
    }

    try {
      const { data } = await axios.post(`${baseUrl}/api/user`, userData);
      setLoading(false);

      toast({
        title: "Registration Successful",
        status: "success",
        duration: 4321,
        isClosable: true,
        position: "top",
      });

      navigate("/chats");
      console.log("data:", data);
    } catch (err) {
      setLoading(false);

      // console.log("err:", err);
      toast({
        title: "Registration Failed",
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
      <FormControl>
        <FormLabel>Upload Profile Picture</FormLabel>
        <Input
          name="pic"
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => handleProfile(e.target.files[0])}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          name="name"
          p={1.5}
          placeholder="Enter Your Name"
          disabled={loading}
          onChange={handleInput}
        />
      </FormControl>

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
        <FormLabel>Create Password</FormLabel>
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

      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            name="confirmPassword"
            p={1.5}
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
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
        Sign Up
      </Button>
    </VStack>
  );
};

export default memo(Signup);
