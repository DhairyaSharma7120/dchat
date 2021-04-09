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
import anime from "animejs";

function Home() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user) {
      db.collection("users").doc(user.uid).set(
        {
          email: user.email,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL,
        },
        { merge: true }
      );
    }
    setLoading(true)
  }, [user]);
  setTimeout(() => setLoading(false), 3000);
  return (
    <div>
      <Head>
        <title>whatsapp web</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {loading ? <Loading /> : !user ? <Login /> : <Sidebar />}
      </main>
    </div>
  );
}

export default Home;
