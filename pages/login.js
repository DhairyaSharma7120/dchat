import styled from "styled-components";
import Head from "next/head";
// import { Button } from "@material-ui/core";
import styles from "../styles/login.module.css";
import {signInWithGoogle} from "../firebase";
import { auth } from "../firebase";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from "firebase"

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  // signInSuccessUrl: '/whatsapp',

  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ]
};
function Login() {
  const signInWithPhoneNumber = async () =>{
    firebase.auth().languageCode = 'en';
// To apply the default browser preference instead of explicitly setting it.
// firebase.auth().useDeviceLanguage();
    
    // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    // window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    //   'size': 'normal',
    //   'callback': (response) => {
    //     // reCAPTCHA solved, allow signInWithPhoneNumber.
    //     // ...
    //   },
    //   'expired-callback': () => {
    //     // Response expired. Ask user to solve reCAPTCHA again.
    //     // ...
    //   }
    // });
    const phoneNumber = prompt("Enter The Phone Number");
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    const appVerifier = window.recaptchaVerifier;
    // const appVerifier = window.recaptchaVerifier;
    console.log(phoneNumber, appVerifier)
    auth.signInWithPhoneNumber(phoneNumber, appVerifier)
    .then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      // ...
    }).catch((error) => {
      // Error; SMS not sent
      // ...
    });
   }
  return (
    <Container>
      <Head>
        <title>Login Page</title>
      </Head>
      {/* <Logo className={styles.Logo} src="/images/WhatsApp-logo.png" /> */}
      <LoginContainer>
        <LoginItems>
          <LoginButton>
            {/* <button 
            onClick={()=>signInWithGoogle()}
            className={styles.googleBtn}>LOGIN WITH GOOGLE</button> */}
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
          </LoginButton><br/>
          <LoginButton>
            <button 
            onClick={()=>signInWithPhoneNumber()}
            className={`${styles.googleBtn} sign-in-button`}>LOGIN WITH MOBILE NUMBER</button>
          </LoginButton>
          <div className="recaptcha-container" id="recaptcha-container"></div>
        </LoginItems>
      </LoginContainer>
    </Container>
  );
}
const Container = styled.div`
  height: 100%;
  display: grid;
  background-color: #37caec;
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
  background-color: #f7f7f7;
  border-left: 2px solid #37caec;
  border-right: 2px solid #37caec;
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
