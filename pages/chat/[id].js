import Head from "next/head";
import styled from "styled-components";
import Sidebar from "../../components/Sidebar";
import { auth,db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import ChatScreen from "../../components/chatscreen"
import { useState, useEffect } from 'react';
import Loading from "../loading"
import getRecipientEmail from "../../utils/getRecipientEmail"
function Chat({messages, chat}) {
  // console.log(messages,chat, " this is laddmald ")
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const recipientEmail = getRecipientEmail(chat.users,user)
  // console.log(recipientEmail,"this is the mail we are getting")
  useEffect(()=>setTimeout(()=>setLoading(false),3000))
  return (<>{loading? <Loading />:
    <Container>
      <Head>
        <title>chat</title>
      </Head>
      <Sidebar email={recipientEmail}/>
      <ChatContainer>
        {chat=="redirect"?<>User Is Deleted</> : <ChatScreen chat={chat} messages={messages}/>}
      </ChatContainer>
    </Container>}</>
  );
}

export async function getServerSideProps(context) {
  if(context.query.id === "redirect"){
    return {
      props: {
          messages: "redirect",
          chat: "redirect"
      }
  }
  }
  const ref = db.collection("chats").doc(context.query.id);
  // console.log(ref.collection("messages"), "this is showing");
  console.log(ref.collection("messages") , "this is the ref")
  // prep the message on the server
  const messageRes = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

    const messages = messageRes.docs.map(doc=>({
        id:doc.id,
        ...doc.data(),
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }))

    // prep the chats
    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }
    // console.log(chat,messages , "t")
    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }
}
const Container = styled.div`
  display: flex;
`;
const ChatContainer = styled.div`
 
`;


export default Chat;
