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
import { useRef } from "react";
import Card from '@material-ui/core/Card';
function Sidebar({ email }) {
  const [user] = useAuthState(auth);

  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);
  
  // console.log(userChatRef,"this is the snapshot")
  const chatAlreadyExists = (recipientEmail) =>
    chatsSnapshot?.docs.some((chat) =>
      chat.data().users.some((user) => user === recipientEmail)
    );

  const createChatWithPhoneNumber = ()=>{
    const input = prompt('Enter the phone number')
    if (!input) return null;
    db.collection("users").get().then(querySnapshot => {
      const documents = querySnapshot.docs.map(doc => doc.data().phoneNumber === `+91${input}` && doc.data().phoneNumber != user.phoneNumber)
      if(documents[0]){ 
        db.collection("chats").add({
          users: [user.phoneNumber, `+91${input}`]
        });}
       else{console.log("user is not using app")}
    })
    
  }

  const createChat = () => {
    const input = prompt(
      "Enter The Email Of The User or Phone Number You Want To Start Chat With"
    );

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
  };

  return (
    <Container>
      <Header>
        <UserAvatar src={user?.photoURL} onClick={() => auth.signOut()} />
        <IconContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
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
      <button className={styles.googleBtn} onClick={createChatWithPhoneNumber}>
        Start a new chat
      </button>

      <UserChatDetails className={`${styles2.sidebarChatDetail}`}>
        {" "}
        {chatsSnapshot?.docs.map((chat) => (
          <Chat
            key={chat.id}
            id={chat.id}
            chatsSnapshot={chatsSnapshot}
            users={chat.data().users}
          />
        ))}
      </UserChatDetails></Content>
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  width: 30vw;
  height: 100vh;
  margin-left: 10px;

  @media (max-width: 600px) {
    width: 100vw;
    /* margin-left: 12px; */
    margin: 0px;
  }
`;
const UserChatDetails = styled.div``;
const ModifiedCard = styled.div`
height: 80vh;`;
const Content = styled.div`
  margin-top: 20px;
  /* border: 1px solid #37caec; */
  background-color: white;
  height: 85vh;
  box-shadow: 0px 0px 4px 0px #37caec
  
  `;
const SearchInput = styled.input`
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
  @media (max-width: 600px) {
    border: none;
    border-bottom: 3px solid #37caec;
  }
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
