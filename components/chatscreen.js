import styled from "styled-components";
import { Avatar, IconButton } from "@material-ui/core";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRef } from "react";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useState, useEffect } from "react";
import firebase from "firebase";
import Message from "./Message";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";
import { app } from "../firebase";
import SendIcon from "@material-ui/icons/Send";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { DevicesRounded } from "@material-ui/icons";
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    display: "grid",
    gridTemplateRows: "33% 33% 33%",
  },
}));
function ChatScreen({ chat, messages }) {
  const fileAttachRef = useRef(null);
  const endOfTheMessageRef = useRef(null);
  const [input, setInput] = useState("");
  const [fileToUpload, setFileToUpload] = useState(null);
  const [preview, setPreview] = useState(false);
  const [recording,setRecording] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
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
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
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

  const scrollToBottom = () => {
    endOfTheMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  useEffect(() => {
    scrollToBottom();
  });
  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollToBottom();
  };

  const handleFile = async (e) => {
    setFileToUpload(e.target.files[0]);
    setPreviewImg(URL.createObjectURL(e.target.files[0]));
    setOpen(true);
    fileAttachRef.current.value = "";
    console.log(previewImg, "this is we are getting in the state");
  };

  const handleFileUpload = async (e) => {
    const file = fileToUpload;

    console.log(file, "this is the file");
    const storageRef = app.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file).then(() => console.log("uploaded"));
    const fileUrl = await fileRef.getDownloadURL();

    e.preventDefault();
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      messageImg: fileUrl,
      user: user.email,
      photoURL: user.photoURL,
    });

    setFileToUpload(null);
    scrollToBottom();
    setOpen(false);
  };

  const recordAudio = async (e) => {
    let device = navigator.mediaDevices.getUserMedia({audio: true})
    let chunks = [];
    let recorder;
    device.then((stream) => {
      recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);

        if (recorder.state == "inactive") {
          let blob = new Blob(chunks, { type: "audio/webm" });
          console.log(blob,"this is blob")
          setAudioUrl(URL.createObjectURL(blob));
        }
      };
      recorder.start();
      setRecording(true)
      console.log("recording started ");
    });
    if(e.target.value=="cancel") {recorder.stop();  return}
    setTimeout(() => {
      recorder.stop();
      setRecording(false)
      console.log("recording ended ss");
      console.log(file, "this is the file");
      const storageRef = app.storage().ref();

      // const fileRef = storageRef.child(file.name);
      // await fileRef.put(file).then(() => console.log("uploaded"));
      // const fileUrl = await fileRef.getDownloadURL();
      // db.collection("users").doc(user.uid).set(
      //   {
      //     lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      //   },
      //   { merge: true }
      // );
  
      // db.collection("chats").doc(router.query.id).collection("messages").add({
      //   timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      //   message: input,
      //   messageAudio: audioUrl,
      //   user: user.email,
      //   photoURL: user.photoURL,
      // });
    }, 10000);

  };
  const stopAudioRecording = () => {
    setRecording(false)
    recorder.stop().then(()=>console.log("recording ended"))
    
  }
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Container>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <ModalPreview>
            <h3>Preview</h3>
            <PreviewImg src={previewImg} />

            <div>
              <SendIcon fontSize="large" onClick={handleFileUpload} />
            </div>
          </ModalPreview>
        </Fade>
      </Modal>

      <audio src={audioUrl} />
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}

        <HeaderInfo>
          <h4>{recipientEmail}</h4>
          {recipientSnapshot ? (
            <p>
              Last Active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "unavailable"
              )}
            </p>
          ) : (
            <p>Loading...</p>
          )}
        </HeaderInfo>
        <HeaderIcon>
          <UploadImage
            ref={fileAttachRef}
            type="file"
            accept="image/x-png,image/gif,image/jpeg"
            id="fileUpload"
            onChange={handleFile}
          ></UploadImage>
          <IconButton>
            <CustomLabel for="fileUpload">
              <AttachFileIcon />
            </CustomLabel>
          </IconButton>
          
          <IconButton>
            
            <MoreVertIcon />
          </IconButton>
        </HeaderIcon>
      </Header>

      <MessageContainer>
        {showMessages()}
        <BeforeEnd>
          <p>{"Your chat is not encrypted this time"}</p>
        </BeforeEnd>
        <EndOfTheMessage ref={endOfTheMessageRef}>{""}</EndOfTheMessage>
      </MessageContainer>

      <InputContainer>
        <InsertEmoticonIcon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <IconButton>
         {recording?<Recorder >
              <CloseIcon value="cancel" onClick={e=>recordAudio(e)} />
            </Recorder>:
          <MicIcon onClick={recordAudio} />}
        </IconButton>
      </InputContainer>
    </Container>
  );
}

const Recorder = styled.div``;
const ModalPreview = styled.div`
  background-color: white;
  border: 4px solid #37caec;
  display: grid;
  > h3 {
    justify-self: center;
  }
  > div {
    justify-self: flex-end;
    padding: 10px;
    transition: 0.3s;
    cursor: pointer;
    :hover {
      transform: scale(1.15);
    }
  }
`;
const Preview = styled.div`
  height: 100%;
  width: 100%;
`;
const PreviewImg = styled.img`
  max-width: 600px;
  max-height: 500px;
`;

const Container = styled.div`
  flex: 1;
  /* overflow:scroll; */
  margin-top: 3px;
  height: 96%;
  width: 70vw;
  transform: scale(0.98);
  @media (max-width: 600px) {
    /* margin: 0; */
    width: 80vw;
    left: 0;
    z-index: 100;
  }
`;
const CustomLabel = styled.label`
  margin: 0;
  padding: 0;
  height: 25px;
  width: 25px;
  cursor: pointer;
`;
const UploadImage = styled.input`
  display: none;
  visibility: none;
`;
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  margin-top: 15px;
  padding: 10px;
  padding-bottom: 0px;
  position: sticky;
  height: 10%;
  bottom: 0;
  background-color: #f0f0f0;
  z-index: 100;
`;
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

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: 0.5px solid #a1dfec;
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
  border-bottom: 3px solid #37caec;
`;
const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;

  > h4 {
    margin: 0px;
    width: 35vw;
    overflow: hidden;
  }

  > p {
    margin: 0px;
    font-size: 14px;
    color: grey;
  }
`;
const HeaderIcon = styled.div``;

export default ChatScreen;
