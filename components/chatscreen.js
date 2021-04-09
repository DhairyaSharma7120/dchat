import styled from "styled-components";
import { Avatar, IconButton } from "@material-ui/core";
import { auth, db } from "../pages/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useCollection } from "react-firebase-hooks/firestore";
import {useRef} from "react"
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useState } from "react";
import firebase from 'firebase'
import Message from "./Message"
import getRecipientEmail from "../utils/getRecipientEmail"
import TimeAgo from "timeago-react"

function ChatScreen({ chat, messages }) {
  const endOfTheMessageRef = useRef(null);
  const [input, setInput] = useState("");
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email","==", getRecipientEmail(chat.users, user))
  )
  const showMessages = () => {
    
    if (messagesSnapshot) {
      console.log(messagesSnapshot.docs.map(message=>message.data()),"this is working but i dont know")
       return messagesSnapshot.docs.map(message => 
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }} />
      );
    }
  }

  const scrollToBottom = () => {
    endOfTheMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  }

  const sendMessage = (e) =>{
    e.preventDefault();
    db.collection("users").doc(user.uid).set({ 
      lastSeen: firebase.firestore.FieldValue.serverTimestamp(),

    },
    {merge: true}
     )

     db.collection("chats").doc(router.query.id).collection("messages").add({
       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
       message: input,
       user: user.email,
       photoURL: user.photoURL,
     })

     setInput("");
     scrollToBottom();
  }
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users,user)
  return (
    <Container>
      <Header>
      {recipient ? (<Avatar src={recipient?.photoURL} />):(
        <Avatar>{recipientEmail[0] }</Avatar>
      )}
        
        <HeaderInfo>
          <h4>{recipientEmail}</h4>
          {recipientSnapshot?(
            <p>Last Active: {' '}
            {recipient?.lastSeen?.toDate() ? (
              <TimeAgo datetime={recipient?.lastSeen?.toDate()}/>
            ): "unavailable"}
            </p>
          ): (
            <p>Loading...</p>
          )}
        </HeaderInfo>
        <HeaderIcon>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcon>
      </Header>

      <MessageContainer>
        {showMessages()}
        <BeforeEnd><p>{'<this is the end of conversation>'}</p></BeforeEnd>
        <EndOfTheMessage ref={endOfTheMessageRef}>{''}</EndOfTheMessage>
      </MessageContainer>

      <InputContainer>
        <InsertEmoticonIcon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button
          hidden
          disabled={!input}
          type="submit"
          onClick={sendMessage}
        >Send Message</button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
}
const Container = styled.div`
  flex: 1;
  /* overflow:scroll; */
  height: 100%;
  width: 70vw;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  height: 10%;
  bottom: 0;
  background-color: #f0f0f0;
  z-index: 100;
`;
const MessageContainer = styled.div`

  margin: 0;
  /* padding: 10px;
  padding-bottom: 0px; */
  padding: 0 10px 0px 10px;
  background-color: #ece5dd;
  height:81vh;
  overflow-y: scroll;
`;
const EndOfTheMessage = styled.div`
  padding:0;
  width:100%;
 
  margin-bottom: 60px;
  text-align: center;
`;

const BeforeEnd = styled.div`
   display: grid;
  place-content: center;
  color: grey;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 15px;
  background-color: white;
  padding: 10px;
  margin-left: 15px;
  margin-right: 15px;
`;
const Header = styled.div`
  position: sticky;
  background-color: #f0f0f0;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 9%;
  align-items: center;
  border-bottom: 1px solid lightgreen;
`;
const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;

  > h4 {
    margin: 0px;
  }

  > p {
    margin: 0px;
    font-size: 14px;
    color: grey;
  }
`;
const HeaderIcon = styled.div``;

export default ChatScreen;

