import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import getRecipientEmail from "../utils/getRecipientEmail";
import getRecipientPhoneNumber from "../utils/getRecipientPhoneNumber";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";   
import React, { useRef, useState } from "react";
import Loading from "../pages/loading";

function Chat({ id, users, chatsSnapshot, chatsSnapshotWithPhone }) {
  const [loading, setLoading] = useState(false);
  const useStyles = makeStyles((theme) => ({
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

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const pid = open ? "simple-popover" : undefined;

  const router = useRouter();
  const [user] = useAuthState(auth);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );
  const [recipientSnapshotWithPhone] = useCollection(
    db
      .collection("users")
      .where("phoneNumber", "==", getRecipientPhoneNumber(users, user))
  );
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(users, user);


  const recipientWithPhone = recipientSnapshotWithPhone?.docs?.[0]?.data();
  const recipientPhoneNumber = getRecipientPhoneNumber(users, user);

  // console.log(recipientWithPhone,recipientPhoneNumber)
  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  const deleteUser = () => {
    router.replace(`/`);
    db.collection("chats").doc(id).delete();
  };

  const clearChat = () => {
    db.collection("chats").doc(id).delete();
  };

  const load = () => {
    router.events.on("routeChangeStart", () => setLoading(true));
    router.events.on("routeChangeComplete", () => setLoading(false));
  };
  return (
    <>
      {" "}
      {loading ? (
        <Loading />
      ) : (
        <Container onClick={load}>
          {recipientWithPhone ? (
            <UserDetail onClick={enterChat}>
              {recipientWithPhone ? (
                <UserAvatar src={recipientWithPhone?.photoURL} />
              ) : (
                <UserAvatar/>
              )}
              {recipientWithPhone?.name ? (
                <UserMail>{recipientWithPhone?.name}</UserMail>
              ) : (
                <UserMail>{recipientPhoneNumber}</UserMail>
              )}
              
            </UserDetail>
          ) : (
            <UserDetail onClick={enterChat}>
              {recipient ? (
                <UserAvatar src={recipient?.photoURL} />
              ) : (
                <UserAvatar>{recipientEmail[0]}</UserAvatar>
              )}
              <UserMail>{recipientEmail}</UserMail>
            </UserDetail>
          )}

          <Options>
            <OptionsIcon
              aria-describedby={id}
              variant="contained"
              color="primary"
              onClick={handleClick}
            />
            <Popover
              pid={pid}
              open={open}
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
              <Typography onClick={deleteUser} className={classes.typography}>
                Delete User
              </Typography>
              <Typography onClick={clearChat} className={classes.typography}>
                Clear Chat
              </Typography>
            </Popover>
          </Options>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  background-color: white;
  display: grid;
  grid-template-columns: 90% 10%;
  cursor: pointer;
  padding: 0px;
  height: 80px;
  word-break: break-word;
  border-bottom: 1px solid #e9eaeb;
  overflow: hidden;
  transition: 0.1s;
  :hover {
    background-color: #f2f2f2;
  }
`;
const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15x;
  justify-self: center;
  align-self: center;
`;
const UserDetail = styled.div`
  align-self: center;
  display: grid;
  height: 100%;
  grid-template-columns: 20% 80%;
`;
const UserMail = styled.div`
  align-self: center;
  width: 100%;
  overflow: hidden;
  display: grid;
`;

const OptionsIcon = styled(MoreVertIcon)`
  /* top: -1px; */

  opacity: 1;
  margin: 0;
  padding: 0;
  transform: scale(0.8);
`;
const Options = styled.div`
  justify-self: center;
  align-self: center;
`;

export default Chat;
