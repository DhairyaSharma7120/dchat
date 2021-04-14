import React from "react";
import styled from "styled-components"
import Message from "../Message"
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../../firebase";
import { useRouter } from "next/router";
function MessageComponent({endOfTheMessageRef}) {
    const router = useRouter();
    // snapshot of the message
    const [messagesSnapshot] = useCollection(
        db
          .collection("chats")
          .doc(router.query.id)
          .collection("messages")
          .orderBy("timestamp", "asc")
      );
    const showMessages = () => {
        if (messagesSnapshot) {
            // console.log(messagesSnapshot.docs.map(message=>message.data()),"this is working but i dont know")
            return messagesSnapshot.docs.map((message) => (
            <Message
                key={message.id}
                user={message.data().user}
                messageId={message.id}
                message={{
                ...message.data(),
                timestamp: message.data().timestamp?.toDate().getTime(),
                }}
            />
            ));
        }
        };

  return (
    <MessageContainer>
      {showMessages()}
      <BeforeEnd>
        <p>{"Your chat is not encrypted this time"}</p>
      </BeforeEnd>

      <EndOfTheMessage ref={endOfTheMessageRef}>{""}</EndOfTheMessage>
    </MessageContainer>
  );
}

export default MessageComponent;
const MessageContainer = styled.div`
  margin-top: 20px;
  /* padding: 10px;
  padding-bottom: 0px; */
  padding: 0 10px 0px 10px;
  border: 1px solid #37caec;
  background-color: white;
  height: 75vh;
  overflow-y: scroll;
`;
const EndOfTheMessage = styled.div`
  padding: 0;
  width: 100%;

  margin-bottom: 60px;
  text-align: center;
`;

const BeforeEnd = styled.div`
  display: grid;
  place-content: center;
  color: grey;
`;