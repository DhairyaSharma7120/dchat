import firebase from "firebase"

const firebaseConfig = {
    apiKey: "AIzaSyAn8PxizHYT9jzmgdZZMhwnjKJoNyoPMGU",
    authDomain: "whatsapp-clone-ee2e7.firebaseapp.com",
    projectId: "whatsapp-clone-ee2e7",
    storageBucket: "whatsapp-clone-ee2e7.appspot.com",
    messagingSenderId: "497720731336",
    appId: "1:497720731336:web:3c28507f44fd1233ee67fd"
  };

  const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig)
  : firebase.app();


  const db = firebase.firestore();
  const auth = app.auth();


  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  export const signInWithGoogle =() => auth.signInWithPopup(provider);

  export { db,auth, provider }