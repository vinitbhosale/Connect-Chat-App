import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { auth, db } from "../firebase";
import { Avatar, IconButton } from "@material-ui/core";
import { useCollection } from "react-firebase-hooks/firestore";
import { useState, useRef } from "react";


import styled from "styled-components";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from '@material-ui/icons/Mic';
import Message from "./Message";
import firebase from "firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";


function ChatScreen({ chat, messages }) {

    const [user] = useAuthState(auth);

    const router = useRouter();

    const [input, setInput] = useState("");

    const endOfMessagesRef = useRef(null);

    const [messageSnapshot] = useCollection(db.collection("chats")
        .doc(router.query.id).collection("messages").orderBy("timestamp", "asc"))

    const [recipientSnapshot] = useCollection(
        db.collection("users").where("email", "==",  getRecipientEmail(chat.users, user))
    );

    const showMessages = () => {
        if (messageSnapshot) {
            return messageSnapshot.docs.map((message) => (
                <Message
                    key={ message.id }
                    user={ message.data().user }
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ));
        } else {
            return JSON.parse(messages).map((message) => (
                <Message key={ message.id } user={ message.user } message={ message } />
            ));
        }
    };

    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }


    const sendMessage = (e) => {
        e.preventDefault();

        // Update the last seen of the user
        db.collection("users").doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        db.collection("chats").doc(router.query.id).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        });

        setInput("");
        scrollToBottom();
    };

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    
    const recipientEmail = getRecipientEmail(chat.users, user);

    return (
        <Container>
            <Header>
                { recipient ? (
                    <Avatar src={ recipient?.photoURL }/>
                ) : (
                    <Avatar>{ recipientEmail[0] }</Avatar>
                )}
    
                <HeaderInfo>
                    <h3>{ recipientEmail }</h3>
                    { recipientSnapshot ? (
                        <p style={{color:"#4e4e5f"}}>Last active: {" "}
                            {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo datetime={ recipient?.lastSeen?.toDate() } />
                            ) : (
                                "Unavailable"
                            )}
                        </p>
                    ) : (
                        <p>Loading Last active...</p>
                    )}
                    
                </HeaderInfo>

                <HeaderIcon>
                    <IconButton>
                        <AttachFileIcon style={{color:"whitesmoke"}}/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon style={{color:"whitesmoke"}}/>
                    </IconButton>
                </HeaderIcon>

            </Header>

            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={ endOfMessagesRef }/>
            </MessageContainer>

            <InputContainer>
                <IconButton>
                    <InsertEmoticonIcon style={{color:"whitesmoke"}} />
                </IconButton>
                <Input style={{color:"whitesmoke"}} placeholder="Type message" value={ input } onChange={ e =>setInput(e.target.value) }/>
                <button hidden disabled={ !input } type="submit" onClick={ sendMessage }></button>
                <IconButton>
                    <MicIcon style={{color:"whitesmoke"}}/>
                </IconButton>
                

            </InputContainer>
        </Container>
    );
}

export default ChatScreen

const Container = styled.div``;

const Header = styled.div`
    position: sticky;
    background-color: #16162c;
    color: whitesmoke;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInfo = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 3px;
    }
    > p {
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcon = styled.div``;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #2e2e42;
    min-height: 90vh;
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom:0;
    background-color: #16162c;
    z-index: 100;
`;

const Input = styled.input`
    flex: 1;
    outline: 0;
    height: 20px;
    border: none;
    border-radius: 50px;
    background-color: #2e2e42;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;

`;



