import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

import styled from "styled-components";
import moment from "moment";

function Message({ user, message }) {
    const [userLoggedIn] = useAuthState(auth);

    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;

    return (
        <Container>
            <TypeOfMessage>
                { message.message }
                <Timestamp>
                    { message.timestamp ? moment(message.timestamp).format("LT") : "..."}
                </Timestamp>
                
            </TypeOfMessage>
        </Container>
    )
}

export default Message

const Container = styled.div``;

const MessageElement = styled.p`
    width: fit-content;
    padding: 15px;
    border-radius : 8px;
    margin: 10px;
    min-width: 60px;
    padding-bottom: 26px;
    position: relative;
    text-align: right;
`;

// SENDER
const Sender = styled(MessageElement)`
    background-color: #d2a8ff;

    margin-left: auto;
`;
// RECEIVER
const Receiver = styled(MessageElement)`
    background-color: white;
    text-align: left;
`;

const Timestamp = styled.span`
    color: gray;
    padding : 10px;
    font-size: 9px;
    position: absolute;
    bottom: 0;
    text-align: right;
    right: 0;
`;
