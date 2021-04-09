import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import moment from "moment"
import MoreVertIcon from '@material-ui/icons/MoreVert';
function Message({ user, message, messageId }) {
  console.log(messageId,"this is the message");
  const [userLoggedIn] = useAuthState(auth);
  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever;
  // console.log("this is also renderin");
  return (
    <Container>
      <TypeOfMessage>
        {message.message}{" "}
        <TimeStamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
          <OptionsIcon />
        </TimeStamp>
      </TypeOfMessage>
      {/* <p>hello</p> */}
    </Container>
  );
}

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
  width: fit-content;
  padding: 12px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  /* padding-bottom:20px; */
  padding-right: 60px;
  position: relative;
  text-align: right;
`;
const OptionsIcon = styled(MoreVertIcon)`
  position: absolute; 
  top: -4px;
  left: 24px;
  opacity:0;
  transition: 0.6s;
  :hover {
    opacity:1;
  }
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const Reciever = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
`;

const TimeStamp = styled.span`
  color: grey;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`;
