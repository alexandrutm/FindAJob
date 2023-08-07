// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyBWkcA4shg6kueV-gvuXGixoKeSTiOkBIY",
authDomain: "jobsforall-ccb0b.firebaseapp.com",
projectId: "jobsforall-ccb0b",
storageBucket: "jobsforall-ccb0b.appspot.com",
messagingSenderId: "180035900338",
appId: "1:180035900338:web:0cd2190f6790982c8dcaab"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth();
const provider = new GoogleAuthProvider();

loginbutton.addEventListener('click',(e)=>{
    signInWithRedirect(auth,provider);

    getRedirectResult(auth)
.then((result) => {
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
}).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
});
    })