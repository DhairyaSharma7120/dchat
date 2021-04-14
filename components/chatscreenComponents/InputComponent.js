import React, { useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { IconButton } from "@material-ui/core";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import CloseIcon from "@material-ui/icons/Close";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";
const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));
function InputComponent({ input, setInput, endOfTheMessageRef }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [recording, setRecording] = useState(false);
  const [audio, setAudio] = useState(null);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const scrollToBottom = () => {
    endOfTheMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const uploadAudio = () => {
    console.log(audio, "this is the audio file");
  };

  const recordAudio = async (e) => {
    let device = navigator.mediaDevices.getUserMedia({ audio: true });
    let chunks = [];
    let recorder;

    device.then((stream) => {
      recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);

        if (recorder.state == "inactive") {
          let blob = new Blob(chunks, { type: "audio/webm" });
          console.log(blob, "this is blob");
          setAudio(blob);
        }
      };

      recorder.start();
      setRecording(true);
      console.log("recording started ");
    });

    if (e.target.value == "cancel") {
      recorder.stop();
      return;
    }

    let timer = 8000;
    setTimeout(() => {
      recorder.stop();
      setRecording(false);
      uploadAudio();
      console.log("recording ended ");
      setAudio(null);
      // console.log(blob,"this is the blob down")
    }, timer);
  };

  const stopAudioRecording = () => {
    setRecording(false);
    recorder.stop().then(() => console.log("recording ended"));
  };

  //  send message function
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
      user: user.email || user.phoneNumber,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollToBottom();
  };

  const handleInputText = (e) => {
    setInput(e.target.value);
  };

  //to add emoji in input
  const addEmoji = (event) => {
    let emoji = event.native;
    setInput(input + emoji);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <InputContainer>
      <IconButton>
        <InsertEmoticonIcon
          aria-describedby={id}
          variant="contained"
          color="primary"
          onClick={handleClick}
          style={{color: 'black'}}
        />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Typography className={classes.typography}>
          <Picker onSelect={addEmoji} />
        </Typography>
      </Popover>

      <Input value={input} onChange={handleInputText} />
      <button hidden disabled={!input} type="submit" onClick={sendMessage}>
        Send Message
      </button>
      <IconButton>
        {recording ? (
          <Recorder>
            <CloseIcon value="cancel" onClick={(e) => recordAudio(e)} />
          </Recorder>
        ) : (
          <MicIcon onClick={recordAudio} />
        )}
      </IconButton>
    </InputContainer>
  );
}

export default InputComponent;
const Recorder = styled.div``;
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  margin-top: 15px;
  padding: 0px 5px 0px 5px;
  position: sticky;
  height: 10%;
  bottom: 0;
  background-color: #f0f0f0;
  z-index: 100;
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
