import React, { useEffect, useRef, memo } from "react";
import { isSameSenderMargin, isSameUser } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatContextProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const scroll = useRef();

  // console.log("messages:", messages);

  // Always scroll to last Message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });

    // eslint-disable-next-line
  }, [messages?.length]);

  return (
    <>
      {messages.map((msg, i) => (
        <div
          ref={scroll}
          key={msg._id}
          style={{
            display: "flex",
          }}
        >
          <div
            style={{
              backgroundColor: `${
                msg.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
              }`,
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "77%",
              marginLeft: isSameSenderMargin(messages, msg, i, user._id),
              marginTop: isSameUser(messages, msg, i) ? 3 : 11,
            }}
          >
            <p style={{ fontSize: "18px" }}>{msg.content}</p>
            <p style={{ fontSize: "12px", color: "GrayText" }}>
              {new Date(msg.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default memo(ScrollableChat);
