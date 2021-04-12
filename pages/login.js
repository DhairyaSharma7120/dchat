import styled from "styled-components";
import Head from "next/head";
// import { Button } from "@material-ui/core";
import styles from "../styles/login.module.css";
import {signInWithGoogle} from "../firebase"
function Login() {
  return (
    <Container>
      <Head>
        <title>Login Page</title>
      </Head>
      <Logo className={styles.Logo} src="/images/WhatsApp-logo.png" />
      <LoginContainer>
        <LoginItems>
          <LoginButton>
            <button 
            onClick={()=>signInWithGoogle()}
            className={styles.googleBtn}>LOGIN WITH GOOGLE</button>
          </LoginButton>
        </LoginItems>
      </LoginContainer>
    </Container>
  );
}
const Container = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 50% 50%;
  overflow: hidden;

  
`;
const LoginButton = styled.div`
  border: 2px solid #37caec;

  transition: 0.3s;
  :hover {
    border: 2px solid #37caec;
  }
  
  @media (max-width: 600px) {
    transform:scale(0.8);
  }
`;

const LoginItems = styled.div`
  justify-self: center;
  align-self: center;
  transform: skewX(-40deg);
`;

const LoginContainer = styled.div`
  /* background-color: white;   */
  border-left: 2px solid #37caec;
  width: 100%;
  height: 100%;
  transform: skewX(40deg);
  display: grid;
`;

const Logo = styled.img`
  justify-self: center;
  align-self: center;
  width: 400px;
  height: 300px;
  
  @media (max-width: 600px) {
    transform:scale(0.5);
  }
`;
export default Login;
