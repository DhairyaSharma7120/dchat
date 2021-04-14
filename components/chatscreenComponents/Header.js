// Imports related to styling of the component
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components/";
import { Avatar, IconButton } from "@material-ui/core";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import TimeAgo from "timeago-react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import SendIcon from "@material-ui/icons/Send";
// Imports related to data from the firebase
import firebase from "firebase";
import { app } from "../../firebase";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../../utils/getRecipientEmail";
import getRecipientPhoneNumber from "../..//utils/getRecipientPhoneNumber";
import { useCollection } from "react-firebase-hooks/firestore";

// This is the styles for preview modal
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
  typography: {
    width: "150px",
      color: "red",
      fontSize: "75%",
      cursor: "pointer",
      padding: theme.spacing(2),
      transition: "0.3s",
      "&:hover": {
        fontSize: "90%",
      },
  },
}));

function HeaderComponent({ chat, input, endOfTheMessageRef }) {
  const router = useRouter();
  // refs in the components
  const fileAttachRef = useRef(null);
  // states for the componenet
  const [fileToUpload, setFileToUpload] = useState(null);
  const [preview, setPreview] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  // for preview modal
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  // getting user from the firebase
  const [user] = useAuthState(auth);
  //This is the snapshot of the user who logged in using Email
  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  //This is the snapshot of the user who logged in using Email
  const [recipientSnapshotWithPhone] = useCollection(
    db
      .collection("users")
      .where("phoneNumber", "==", getRecipientPhoneNumber(chat.users, user))
  );

  // recipent data and email addresses
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);

  // recipent data and phone Number
  const recipientWithPhone = recipientSnapshotWithPhone?.docs?.[0]?.data();
  const recipientPhoneNumber = getRecipientPhoneNumber(chat.users, user);

  const scrollToBottom = () => {
    endOfTheMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  //File Upload function
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

  //this is the function to clear the chat
  const clearChat = () => {};
  // functions to open and close modal
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // chat options open and close mod
  const handleOpenChatOptions = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseChatOptions = () => {
    setAnchorEl(null);
  };

  const openOptions = Boolean(anchorEl);
  const pid = openOptions ? "simple-popover" : undefined;
  return (
    <>
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

      <Header>
        {recipientWithPhone ? (
          <>
            {recipientWithPhone ? (
              <Avatar src={recipient?.photoURL} />
            ) : (
              <Avatar />
            )}{" "}
          </>
        ) : (
          <>
            {recipient ? (
              <Avatar src={recipient?.photoURL} />
            ) : (
              <Avatar>{recipientEmail[0]}</Avatar>
            )}{" "}
          </>
        )}

        <HeaderInfo>
          {recipientWithPhone ? (
            <h4>{recipientPhoneNumber}</h4>
          ) : (
            <>
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
            </>
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
            <MoreVertIcon
              aria-describedby={pid}
              variant="contained"
              color="primary"
              onClick={handleOpenChatOptions}
            />
          </IconButton>
        </HeaderIcon>
        <Popover
          pid={pid}
          open={openOptions}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Typography onClick={clearChat} className={classes.typography}>
            Clear Chat
          </Typography>
        </Popover>
      </Header>
    </>
  );
}

export default HeaderComponent;
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

const UploadImage = styled.input`
  display: none;
  visibility: none;
`;

const CustomLabel = styled.label`
  margin: 0;
  padding: 0;
  height: 25px;
  width: 25px;
  cursor: pointer;
`;

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
