import { Avatar, IconButton, Button } from "@material-ui/core";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

import styled from "styled-components";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator';
import Chat from "../components/Chat"; 

function Sidebar() {

    const [user] = useAuthState(auth);

    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);

    const [chatSnapshot] = useCollection(userChatRef);

    const createChat = () => {
        const input = prompt(
            "Please enter an email address for the user you wish to chat with"
        );

        if(!input) return null;

        if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email ) {
            // We need to add chat into the DB 'chats' colletion if it dosen't already exist and is valid
            db.collection('chats').add({
                users: [user.email, input],
            });
        }
    };

    // function to check chat already exist
    const chatAlreadyExists = (recipientEmail) =>
        !!chatSnapshot?.docs.find(
            (chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0
        );

    return (
        <Container>
            <Header>
                <UserAvatar src={ user.photoURL }/>
                <IconsContainer>
                    <IconButton>
                        <ExitToAppIcon style={{color:"whitesmoke"}} onClick={() => auth.signOut()}/>
                    </IconButton>
                </IconsContainer>
            </Header>
            
            <Search>
                <SearchIcon style={{color:"whitesmoke"}}/>
                <SearchInput style={{color:"whitesmoke"}} placeholder="Search chats" />            
            </Search>

            <SidebarButton style={{color:"whitesmoke"}} onClick={ createChat }>Start a new chat</SidebarButton>


            {/**List of chats */}
            {chatSnapshot?.docs.map(chat => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
            ))}
        </Container>
    )
}

export default Sidebar;

const Container = styled.div`
    flex: 0.45;
    border-right : 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;
    background-color: #16162c;
    ::-webkit-scrollbar {
        display: none;
         
    }

    ::-webkit-scrollbar-track {
        background: #4e4e5f;
    }
`;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 5px;
    border-radius: 25px;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
    background-color: #2e2e42;

`;

const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
    background-color: #2e2e42;
`;

const SidebarButton = styled(Button)`
    width: 100%;

    &&&{
        border-radius: 0px;
        border-top: 1px solid #4e4e5f;
        border-bottom: 1px solid #4e4e5f;
    }
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: #16162c;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px black;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover{
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div``;
