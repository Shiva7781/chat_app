import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;

    setUserData({ ...userData, [name]: value });
  };
  const handlePassword = () => setShow(!show);

  const handleSubmit = () => {};

  return (
    <VStack spacing="5px">
      <FormControl id="emailL" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          type="email"
          p={1.5}
          placeholder="Enter Your Email"
          onChange={handleInput}
        />
      </FormControl>

      <FormControl id="passwordL" isRequired>
        <FormLabel>Password</FormLabel>
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

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={handleSubmit}
      >
        Login
      </Button>
    </VStack>
  );
};

export default Login;
