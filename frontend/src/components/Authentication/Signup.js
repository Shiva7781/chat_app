import React, { useState } from "react";
import {
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

const Signup = () => {
  const [userData, setUserData] = useState({
    pic: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState(false);
  console.log("userData:", userData);

  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name === "pic") {
      setUserData({
        ...userData,
        [name]: URL.createObjectURL(e.target.files[0]),
      });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };
  const handlePassword = () => setShow(!show);

  const handleSubmit = () => {};

  return (
    <VStack spacing="5px">
      <FormControl id="pic">
        <FormLabel>Upload Profile Picture</FormLabel>
        <Input
          name="pic"
          type="file"
          p={1.5}
          accept="image/*"
          onChange={handleInput}
        />
      </FormControl>

      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          name="name"
          p={1.5}
          placeholder="Enter Your Name"
          onChange={handleInput}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          type="email"
          p={1.5}
          placeholder="Enter Your Email"
          onChange={handleInput}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Create Password</FormLabel>
        <InputGroup>
          <Input
            name="password"
            p={1.5}
            type={show ? "text" : "password"}
            placeholder="Create Password"
            onChange={handleInput}
          />

          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handlePassword}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            name="confirmPassword"
            p={1.5}
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
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
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
