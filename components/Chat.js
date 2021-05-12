import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";

import styled from "styled-components";
import getRecipientEmail from "../utils/getRecipientEmail";

function Chat({ id, users }) {

    const router = useRouter();

    const [user] = useAuthState(auth);

    const [recipientSnapshot] = useCollection(db.collection('users').where(
        'email', '==', getRecipientEmail(users, user)));

    const enterChat = () => {
        router.push(`/personChat/${id}`)
    }
    
    const recipient = recipientSnapshot?.docs?.[0]?.data();

    const recipientEmail = getRecipientEmail(users, user);

    return (
        <Container onClick={ enterChat }>
            { recipient ? (
                <UserAvatar src={ recipient?.photoURL }/>
            ):(
                <UserAvatar src={ recipientEmail[0]?.photoURL }></UserAvatar>
            )}
            <p>{ recipientEmail }</p>
        </Container>
    );
}

export default Chat

const Container = styled.div`
    color: whitesmoke;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;

    :hover {
        background-color: #4e4e5f;
    }

`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;
