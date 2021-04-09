import styled from "styled-components"
import { Avatar } from '@material-ui/core'
import getRecipientEmail from "../utils/getRecipientEmail"
import { auth, db } from "../pages/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import {useRouter} from "next/router"
function Chat({id,users}) {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [recipientSnapshot] = useCollection(
        db.collection("users").where("email", "==", getRecipientEmail(users,user))
    )
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(users, user)
    
    const enterChat = () => {
        router.push(`/chat/${id}`)
    }
    return (
        <Container onClick={enterChat}>
            {recipient?
               ( <UserAvatar src={recipient?.photoURL}/>) : 
               <UserAvatar>{recipientEmail[0]}</UserAvatar>
            }
            <p>{recipientEmail}</p>
        </Container>
    )
}
const Container = styled.div`
    background-color: white;
    display: flex;
    align-items:center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;
    border-bottom: 1px solid #e9eaeb;
    /* overflow:scroll; */
    transition:0.1s;    
    :hover{
        background-color: #f2f2f2;
    }
`;
const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15x;
`
export default Chat