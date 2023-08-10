import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getStorage,ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

// Firebase config
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
// Inițializarea și utilizarea Firestore 
const firestoreDB = getFirestore(app);
const storage = getStorage();

// Function to check if the user is logged in using Firebase Authentication
function isUserLoggedIn() {
    // Check if there is a currently authenticated user
    const user = auth.currentUser;

    return !!user;
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
            });

            
    }
    else{
        redirectToCreateJob();
    }

})

const form = document.querySelector('#createJobForm');
form.addEventListener('submit',async (e) => {
  e.preventDefault();

  const jobsCollection = collection(firestoreDB, "jobs");

  const imageFile = form.querySelector('#job-image').files[0];

  const newJobData = {
    title: form.querySelector('#job-title').value,
    location: form.querySelector('#location').value,
    type: form.querySelector('#job-type').value,
    description:  form.querySelector('#description').value,
    salary: form.querySelector('#job-salary').value,
    currency: form.querySelector('#job-currency').value,
  };

try {
    const storageRef = ref(storage, "job_images/" + imageFile.name);
    const imageSnapshot = await uploadBytes(storageRef, imageFile);

    const imageUrl = await getDownloadURL(imageSnapshot.ref);

    newJobData.imageUrl = imageUrl;

    const docRef = await caddDoc(jobsCollection, newJobData);
    console.log("Document written with ID: ", docRef.id);

    form.reset();

  } catch (error) {
    console.error("Error adding document: ", error);
  }

});


// Funcția pentru adăugarea unui loc de muncă în containerul job-list-container
function addJobToContainer(jobData) {
  const jobItem = document.createElement("div");
  jobItem.classList.add("job-item");

  jobItem.innerHTML = `
      <div class="row g-4">
          <div class="col-sm-12 col-md-8 d-flex align-items-center">
              <img class="flex-shrink-0 img-fluid border rounded" src="${jobData.logo}" alt="" style="width: 80px; height: 80px;">
              <div class="text-start ps-4">
                  <h5 class="mb-3">${jobData.jobTitle}</h5>
                  <span class="text-truncate me-3"><i class="fa fa-map-marker-alt text-primary me-2"></i>${jobData.location}</span>
                  <span class="text-truncate me-3"><i class="far fa-clock text-primary me-2"></i>${jobData.jobType}</span>
                  <span class="text-truncate me-0"><i class="far fa-money-bill-alt text-primary me-2"></i>${jobData.salary}</span>
              </div>
          </div>
          <div class="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
              <div class="d-flex mb-3">
                  <a class="btn btn-light btn-square me-3" href=""><i class="far fa-heart text-primary"></i></a>
                  <a class="btn btn-primary" href="">Aplica</a>
              </div>
              <small class="text-truncate"><i class="far fa-calendar-alt text-primary me-2"></i>Data limită: ${jobData.deadline}</small>
          </div>
      </div>
  `;

  document.querySelector(".job-list-container").appendChild(jobItem);
}

// Funcția pentru filtrarea locurilor de muncă
function filterJobs(filterType) {
  const jobItems = document.querySelectorAll(".job-item");

  jobItems.forEach((jobItem) => {
    const jobTypeElement = jobItem.querySelector(".text-truncate.me-3:nth-child(3)");
    const jobType = jobTypeElement.textContent.split(' ')[1];
    
    if (filterType === "all" || jobType === filterType) {
        jobItem.style.display = "block";
    } else {
        jobItem.style.display = "none";
    }
  });
}

document.querySelectorAll(".nav-pills a").forEach((tabLink) => {
  tabLink.addEventListener("click", function (event) {
      event.preventDefault();
      const targetTab = this.getAttribute("href");

      if (targetTab === "#tab-1") {
          filterJobs("all");
      } else if (targetTab === "#tab-2") {
          filterJobs("Full");
      } else if (targetTab === "#tab-3") {
          filterJobs("Part");
      }
  });
});

console.log("A început inițializarea DOMContentLoaded");
document.addEventListener("DOMContentLoaded", function() {
  console.log("Evenimentul DOMContentLoaded a fost declanșat");
  const jobData = [
      {
          logo: "img/com-logo-5.jpg",
          jobTitle: "Wordpress Developer",
          location: "Brăila, România",
          jobType: "Full Time",
          salary: "$123 - $456",
          deadline: "01 Jan, 2045"
      },
  ];

  jobData.forEach((job) => {
      addJobToContainer(job);
  });
});