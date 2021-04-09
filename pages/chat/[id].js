import Head from "next/head";
import styled from "styled-components";
import Sidebar from "../../components/Sidebar";
import { db } from "../firebase";
import ChatScreen from "../../components/chatscreen"
function Chat({messages, chat}) {
  // console.log(messages,chat, " this is laddmald ")
  return (
    <Container>
      <Head>
        <title>chat</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages}/>
      </ChatContainer>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);
  // console.log(ref.collection("messages"), "this is showing");

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
