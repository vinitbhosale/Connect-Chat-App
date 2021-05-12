import { Button } from "@material-ui/core";
import { auth, provider } from "../firebase";

import Head from "next/head";
import styled from "styled-components";



function Login() {

    const signIn = () => {
        auth.signInWithPopup(provider).catch(alert)
    };

    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>

            <LoginContainer>
                <Logo src="https://logodix.com/logo/2048537.jpg" />
                <Button onClick={signIn} variant="outlined">Sign in with Google</Button>
            </LoginContainer>
        </Container>
    )
}

export default Login

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: whitesmoke;
`;

const LoginContainer = styled.div`
    padding: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 4px 14px -3px #A4508B;
`;

const Logo = styled.img`
    height: 300px;
    width: 300px;
    margin-bottom: 50px;
`;
