import React, { useRef, useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/whatsapp.module.css";
import Sidebar from "../components/Sidebar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import Login from "./login";
import Loading from "./loading";
import firebase from "firebase";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import ForumIcon from '@material-ui/icons/Forum';
import SmsSharpIcon from '@material-ui/icons/SmsSharp';
import styled from "styled-components";
const Home = () =>{
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  
  useEffect(async() => {
    setLoading(true);
    if (user) {
      await db.collection("users").doc(user.uid).set(
        { 
          phoneNumber: user.phoneNumber,
          email: user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL,
        },
        { merge: true }
      );
    }
    setLoading(false)
  }, [user]);
  // setTimeout(() => setLoading(false), 3000);
  // console.log(user.phoneNumber,"this is the user we are getting")
  return (
    <div>
      <Head>
        <title>dchat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {loading ? (
          <Loading />
        ) : !user ? (
          <Login />
        ) : (
          <WhatsApp>
            <Sidebar /> 
            <Welcome>
              <Icon><ForumIcon style={{ fontSize: 200 }}/></Icon>
              <Message>Chat Application Made By Dhairya</Message>
            </Welcome>
          </WhatsApp>
        )}
      </main>
    </div>
  );
}
const WhatsApp = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 30% 70%;
`;
const Welcome = styled.div`
  width: 100%;
  height: 100%;
  justify-self: center;
  align-self: center;
  display: grid;
  grid-template-rows: 70% 30%;

  @media (max-width: 600px) {
    display:none;
  }
`;

const Icon = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-content: center;
  align-content: flex-end;
  color: #37caec;
  right: 0;
`;
const Message = styled.div`
  justify-self: center;

  font-weight:bold;
  color: #37caec;
  right: 0;
`;

export default Home;
