import { Avatar, IconButton } from "@material-ui/core";
import styled from "styled-components";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "../components/chat";
import styles from "../styles/login.module.css";
import styles2 from "../styles/sidebar.module.css";
import * as EmailValidator from "email-validator";
import { useRef, useState } from "react";
import Card from "@material-ui/core/Card";
import React from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { useSpring, animated } from "react-spring/web.cjs";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";

const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool.isRequired,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};

function Sidebar({ email }) {
  const disableEmailRef = useRef(null);
  const disablePhoneRef = useRef(null);
  const [newChatInput , setNewChatInput] = useState(null);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [openNewChatWithEmail, setOpenNewChatWithEmail] = React.useState(false);
  const [openNewChatWithPhoneNumber, setOpenNewChatWithPhoneNumber] = React.useState(false);
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

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const pid = openPopover ? "simple-popover" : undefined;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenNewChatWithEmail = () => {
    setOpenNewChatWithEmail(true);
  };

  const handleCloseNewChatWithEmail = () => {
    setOpenNewChatWithEmail(false);
  };

  const handleOpenNewChatWithPhoneNumber = () => {
    setOpenNewChatWithPhoneNumber(true);
  };

  const handleCloseNewChatWithPhoneNumber = () => {
    setOpenNewChatWithPhoneNumber(false);
  };

  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  const userChatRefWithPhone = db
    .collection("chats")
    .where("users", "array-contains", user.phoneNumber);
  const [chatsSnapshotWithPhone] = useCollection(userChatRefWithPhone);
  // console.log(userChatRef,"this is the snapshot")
  const chatAlreadyExists = (recipientEmail) =>
    chatsSnapshot?.docs.some((chat) =>
      chat.data().users.some((user) => user === recipientEmail)
    );

  const createChatWithPhoneNumber = () => {
    const input = newChatInput;
    if (!input) return null;
    // console.log(user.phoneNumber,"this is users Number")
    db.collection("users")
      .get()
      .then((querySnapshot) => {
        const documents = querySnapshot.docs.map(
          (doc) =>
            doc.data().phoneNumber === `+91${input}` &&
            doc.data().phoneNumber != user.phoneNumber
        );
        // console.log(documents, "this is the document")
        documents.map(ele => ele? db.collection("chats").add({
          users: [user.phoneNumber, `+91${input}`],
        }) :  console.log("user is not using app") )
      //   if (documents[0]) {
      //     db.collection("chats").add({
      //       users: [user.phoneNumber, `+91${input}`],
      //     });
      //     console.log("chat created");
      //   } else {
      //     console.log("user is not using app");
      //   }
      });
    setOpenNewChatWithPhoneNumber(false);
    setOpen(false);
  };

  const createChat = (e) => {
    const input = newChatInput;
    console.log(input,"this is the input")
    if (!input) return null;
    // console.log(chatAlreadyExists(input),"this is boolean")
    // console.log(EmailValidator.validate(input),"this is the validator")

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      // console.log(!chatAlreadyExists(input), "chatalrea");
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
    setOpenNewChatWithEmail(false);
    setOpen(false);
    
  };
  console.log(user.phoneNumber, "this is we are getting");
  return (
    <Container>
      <Header>
        <UserAvatar
          src={user?.photoURL}
          
        />
        <IconContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon onClick={handleOpenPopover}/>
            <Popover
              pid={pid}
              open={openPopover}
              anchorEl={anchorEl}
              onClose={handleClosePopover}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Typography onClick={() => {
            router.replace("/");
            setTimeout(()=>auth.signOut(),500);
          }} className={classes.typography}>
                Log Out
              </Typography>
            </Popover>
          </IconButton>
        </IconContainer>
      </Header>
      <Content>
        <Search>
          <SearchContainer>
            <IconButton>
              <SearchIcon />
            </IconButton>

            <SearchInput />
          </SearchContainer>
        </Search>
        <button className={styles.googleBtn} onClick={handleOpen}>
          Start a new chat
        </button>
        <ModifiedModal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          open={openNewChatWithEmail}
          onClose={handleCloseNewChatWithEmail}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <ModifiedFade in={openNewChatWithEmail}>
            <div>
              <h2 id="spring-modal-title">Chat Options</h2>
              <input
                id="spring-modal-description"
              
                onChange={e=>setNewChatInput(e.target.value)}
              />
              
              <Button
                id="spring-modal-description"
                
                value={newChatInput}
                onClick={createChat}
              >
                Create Chat
              </Button>
            </div>
          </ModifiedFade>
        </ModifiedModal>

        <ModifiedModal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          open={openNewChatWithPhoneNumber}
          onClose={handleCloseNewChatWithPhoneNumber}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <ModifiedFade in={openNewChatWithPhoneNumber}>
            <div>
              <h2 id="spring-modal-title">Chat Options</h2>
              <input
                id="spring-modal-description"
           
                onChange={e=>setNewChatInput(e.target.value)}
              />
              
              <Button
                id="spring-modal-description"
                onClick={createChatWithPhoneNumber}
              >
                Create Chat
              </Button>
            </div>
          </ModifiedFade>
        </ModifiedModal>

        <ModifiedModal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <ModifiedFade in={open}>
            <div>
              <h2 id="spring-modal-title">Chat Options</h2>
              <Button
                id="spring-modal-description"
                disabled={!user.email}
                onClick={handleOpenNewChatWithEmail}
              >
                Email
              </Button>
              <Button
                id="spring-modal-description"
                disabled={!user.phoneNumber}
                onClick={handleOpenNewChatWithPhoneNumber}
              >
                Phone Number
              </Button>
            </div>
          </ModifiedFade>
        </ModifiedModal>
        <UserChatDetails className={`${styles2.sidebarChatDetail}`}>
          {" "}
          {chatsSnapshotWithPhone?.docs.map((chat) => (
            <Chat
              key={chat.id}
              id={chat.id}
              chatsSnapshotWithPhone={chatsSnapshotWithPhone}
              users={chat.data().users}
            />
          ))}
          {chatsSnapshot?.docs.map((chat) => (
            <Chat
              key={chat.id}
              id={chat.id}
              chatsSnapshot={chatsSnapshot}
              users={chat.data().users}
            />
          ))}
        </UserChatDetails>
      </Content>
    </Container>
  );
}

export default Sidebar;
const ModifiedModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;
const ModifiedFade = styled(Fade)`
  background-color: white;
  outline: none;
  padding: 20px;
  border-radius: 0px;
  > div {
    > p {
      cursor: pointer;
      transition: 0.3s;
      :hover {
        font-size: 105%;
      }
    }
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  /* margin-left: 10px; */
  /* padding-bottom: 0px;
    overflow: hidden; */
  @media (max-width: 750px) {
    width: 100vw;
    z-index: 99;
  }
`;

const UserChatDetails = styled.div``;
const ModifiedCard = styled.div`
  height: 80vh;
`;
const Content = styled.div`
  margin-top: 20px;
  /* border: 1px solid #37caec; */
  background-color: white;
  height: 85vh;
  box-shadow: 0px 0px 4px 0px #37caec;
`;
const SearchInput = styled.input`
  width: 80%;
  outline: none;
  border: none;
  flex: 1;
`;
const Search = styled.div`
  height: 50px;
  background-color: #f8f8fb;
  display: grid;
`;
const SearchContainer = styled.div`
  border-radius: 18px;
  width: 90%;
  height: 70%;
  background-color: white;
  align-self: center;
  justify-self: center;
  display: flex;
  align-items: center;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  margin-top: 5px;
  background-color: white;
  /* background-color: whitesmoke; */
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 60px;
  border: 3px solid #37caec;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  transition: 0.3s;
  border: 1px solid transparent;
  :hover {
    /* transform: scale(1.05); */
    border: 1px solid #06d755;
  }
`;

const IconContainer = styled.div``;
