import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { db,auth } from "../firebase";
import moment from "moment"
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import React ,{useRef} from 'react'

import { useRouter } from "next/router";
const useStyles = makeStyles((theme) => ({
  typography: {
    width:"150px",
    color: "red",
    fontSize: "75%", 
    cursor:"pointer",
    padding: theme.spacing(2),
  },
}));


function Message({ user, message, messageId }) {
  // console.log(messageId,"this is the message");

  const unmountRef = useRef(null) 
  const router = useRouter()
  const [userLoggedIn] = useAuthState(auth);
  const TypeOfMessage = user === userLoggedIn.email ? Sender : Reciever;
  // console.log("this is also renderin");
  const messagesSnapshot = 
      db.collection("chats")
      .doc(router.query.id)
      .collection("messages")
      
 
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    
    setAnchorEl(event.currentTarget)
  };

  const deleteMessage = () => {
    unmountRef.current.style.transform='scale(0)';
    // unmountRef.current.style.left;
    setTimeout(()=>messagesSnapshot.doc(messageId).delete(),300)
  }
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <Container >
      <TypeOfMessage ref={unmountRef}>
        {message.message}{" "}
        <TimeStamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </TimeStamp>
        <div></div>
        <OptionsIcon aria-describedby={id} variant="contained" color="primary" onClick={handleClick} />
      </TypeOfMessage>
      {/* <p>hello</p> */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
       
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography  onClick= {deleteMessage} className={classes.typography}>Delete Message</Typography>
      </Popover>
    </Container>
  );
}

export default Message;

const Container = styled.div`
  transition: 0.4s
`;

const MessageElement = styled.p`
  width: fit-content;
  padding: 6px 7px 8px 9px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  /* padding-bottom:20px; */
  padding-right: 60px;
  position: relative;
  text-align: right;
  animation-name: message;
  animation-duration: 0.4s;
  /* cursor: pointer; */
  @keyframes message {
    0%{
      transform: scale(0);
    }
    100%{
      transform: scale(1);
    }
  }
`;
const OptionsIcon = styled(MoreVertIcon)`
  position: absolute; 
  /* top: -1px; */
  right: 0px;
  opacity:0;  
  margin:0;
  padding:0;
  transform: scale(0.8);
 
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
  transition: 0.3s;
  >div{
    /* width:4px;
    height: 5px;
    background-color: red;*/
    position: absolute;
    top:-2px;
    right:-10px; 
    width: 0; 
    height: 0; 
    border-top: 4px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 13px solid #dcf8c6;
    /* border-radius: 7px; */
    transform : rotate(-20deg);
  }
  &:hover ${OptionsIcon} {
    opacity: 1;
    background:  #dcf8c6; 
    box-shadow: -10px 0px 8px 2px #dcf8c6;
    color: black;
  }
`;

const Reciever = styled(MessageElement)`
  background-color: white;
  text-align: left;
  transition: 0.3s;
  >div{
    /* width:4px;
    height: 5px;
    background-color: red;*/
    position: absolute;
    top:-2px;
    left:-9px; 
    width: 0; 
    height: 0; 
    border-top: 4px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 13px solid white;
    /* border-radius: 7px; */
    transform : rotate(20deg);
  }
 
  &:hover ${OptionsIcon} {
    opacity: 1;
    background:  white; 
    box-shadow: -10px 0px 8px 2px white;
    color: black;
    animation-name: optionIcon;
    animation-duration: 0.5s;
    @keyframes optionIcons {
      0%{top:10px}
      100%{top:0;}
    }
  }
`;

const TimeStamp = styled.span`
  color: grey;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;

  >div{

  }
`;
