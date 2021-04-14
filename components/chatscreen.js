import React, { useState, useEffect, useRef } from "react";

import styled from "styled-components";
import HeaderComponent from "./chatscreenComponents/Header"
import MessageComponent from "./chatscreenComponents/MessageComponent"
import InputComponent from "./chatscreenComponents/InputComponent"



function ChatScreen({ chat, messages }) {

  const endOfTheMessageRef = useRef(null);
  const [input, setInput] = useState("");

  const scrollToBottom = () => {
    endOfTheMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  useEffect(() => {
    scrollToBottom();
  });

  return (
    <Container>
      
      <HeaderComponent chat={chat} input={input} endOfTheMessageRef=
      {endOfTheMessageRef}
      />

      <MessageComponent endOfTheMessageRef={endOfTheMessageRef} />
      
      <InputComponent
        setInput={setInput}
        input={input}
        endOfTheMessageRef={endOfTheMessageRef}
      />
    </Container>
  );
}

const Container = styled.div`
  
  /* overflow:scroll; */
  margin-top: 3px;
  height: 96%;
  width: 100%;
  transform: scale(0.98);
  z-index: 100;
  @media (max-width: 750px){
    height: 100%;
    transform: scale(1)
  }
`;

export default ChatScreen;
