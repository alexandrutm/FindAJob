// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDCcTKpPdMmC4SiMPiluWX4Njbp09tWrxc",
    authDomain: "findajob-75780.firebaseapp.com",
    projectId: "findajob-75780",
    storageBucket: "findajob-75780.appspot.com",
    messagingSenderId: "561262637440",
    appId: "1:561262637440:web:e1b41de16d55bdd6a71165",
    measurementId: "G-4B4GBB2BMW"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth();
const provider = new GoogleAuthProvider();
const database =getDatabase(app);

// Function to check if the user is logged in using Firebase Authentication
function isUserLoggedIn() {
    // Check if there is a currently authenticated user
    const user = auth.currentUser;

    return !!user; // Returns true if there's a user, false otherwise.
}

// Function to redirect the user to the "create job" page
function redirectToCreateJob() {
    window.location.href = 'create_job.html';
}

loginbutton.addEventListener('click',(e)=>{
    if(!isUserLoggedIn())
    {
        signInWithRedirect(auth,provider);

        getRedirectResult(auth)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access Google APIs.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
    
                // The signed-in user info.
                const user = result.user;
                
                redirectToCreateJob();

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

            
    }
    else{
        redirectToCreateJob();
    }

})


const form = document.querySelector('createJobForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const jobTitle = form.querySelector('#job-title').value;
  const location = form.querySelector('#location').value;
  const jobType = form.querySelector('#job-type').value;
  const description = form.querySelector('#description').value;
  const salary = form.querySelector('#job-salary').value;
  const currency = form.querySelector('#job-currency').value;

   // Push the job data to Firebase
   database.ref('jobs').push({
    title: jobTitle,
    location: location,
    type: jobType,
    description: description,
    salary: salary,
    currency: currency,
  }).then(() => {
    // Reset the form after successful submission
    form.reset();

    // Redirect to the jobs page after successful job creation
    window.location.href = 'job-list.html'; // Replace 'jobs.html' with the actual URL of your jobs page
  }).catch((error) => {
    // Handle any errors that occurred during the database operation, if needed
    console.error('Error creating job:', error);
  });
});