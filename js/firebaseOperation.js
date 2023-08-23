import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, updateDoc, getDocs, arrayUnion  } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { getStorage,ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBHjXrIvH99X0ezI18BZ2dCR8KVAHRu_DA",
  authDomain: "findajob-a0c7a.firebaseapp.com",
  projectId: "findajob-a0c7a",
  storageBucket: "findajob-a0c7a.appspot.com",
  messagingSenderId: "135848872701",
  appId: "1:135848872701:web:ef2dd55ab673b06b854c94",
  measurementId: "G-NXFSKEF3PZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth();
const provider = new GoogleAuthProvider();
// Inițializarea și utilizarea Firestore 
const firestoreDB = getFirestore(app);
const storage = getStorage();

function isUserLoggedIn() {
    const user = auth.currentUser;

    return !!user;
}
function redirectToCreateJob() {
    window.location.href = 'create_job.html';
}

loginbutton.addEventListener('click',(e)=>{
    if(!isUserLoggedIn())
    {
        signInWithRedirect(auth,provider);

        getRedirectResult(auth)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
    
                const user = result.user;
                
                redirectToCreateJob();

            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });

            
    }
    else{
        redirectToCreateJob();
    }

})

//upload job
const form = document.querySelector('#createJobForm');
if(form)
{
form.addEventListener('submit',async (e) => {
    const messageBox = document.getElementById("messageBox");

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
        deadline:form.querySelector('#job-deadline').value,
        applicants:[]
        };
    
        try {
        const storageRef = ref(storage, "job_images/" + imageFile.name);
        const imageSnapshot = await uploadBytes(storageRef, imageFile);
    
        const imageUrl = await getDownloadURL(imageSnapshot.ref);
    
        newJobData.imageUrl = imageUrl;
    
        const docRef = await addDoc(jobsCollection, newJobData);
        console.log("Document written with ID: ", docRef.id);
        messageBox.textContent = "Document uploaded successfully.";
        form.reset();
    
        } catch (error) {
        console.error("Error adding document: ", error);
        }
    });
}

// Funcția pentru adăugarea unui loc de muncă în containerul job-list-container
function addJobToContainer(jobData) {
    const jobItem = document.createElement("div");
    jobItem.classList.add("job-item");
    jobItem.id=jobData.id;

    jobItem.innerHTML = `
        <div class="job-item p-4 mb-4">
            <div class="row g-4">
                <div class="col-sm-12 col-md-8 d-flex align-items-center">
                    <img class="flex-shrink-0 img-fluid border rounded" src="${jobData.imageUrl}" alt="" style="width: 80px; height: 80px;">
                    <div class="text-start ps-4">
                        <h5 class="mb-3">${jobData.title}</h5>
                        <span class="text-truncate me-3"><i class="fa fa-map-marker-alt text-primary me-2"></i>${jobData.location}</span>
                        <span class="text-truncate me-3"><i class="far fa-clock text-primary me-2"></i>${jobData.type}</span>
                        <span class="text-truncate me-0"><i class="far fa-money-bill-alt text-primary me-2"></i>${jobData.salary} ${jobData.currency}</span>
                    </div>
                </div>
                <div class="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
                    <div class="d-flex mb-3">
                        <a class="btn btn-light btn-square me-3" href=""><i class="far fa-heart text-primary"></i></a>
                        <a class="btn btn-primary" href="">Aplica</a>
                    </div>
                    <small class="text-truncate"><i class="far fa-calendar-alt text-primary me-2"></i>Data limită: ${jobData.deadline}</small>
                    <!-- Hidden field -->
                    <div class="description" style="display: none;">${jobData.description}</div>  
                    <div class="jobId" style="display: none;">${jobData.id}</div>      
                </div>
            </div>
        </div>
    `;
    
    const jobListContainer = document.querySelector(".job-list-container");
    if (jobListContainer) {
      jobListContainer.appendChild(jobItem);
    }
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

document.addEventListener("DOMContentLoaded", async  function() {
    const jobsCollection = collection(firestoreDB, "jobs");
    try {
        const querySnapshot = await getDocs(jobsCollection);
    
        querySnapshot.forEach((doc) => {
          const jobData = doc.data();
          jobData.id=doc.id;
          addJobToContainer(jobData);
        });
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }

});

//aplica pentru altcineva
const applicationForm = document.querySelector('#applicationForm');
if (applicationForm) {
  applicationForm.addEventListener('submit', async (e) => {
    const messageBox = document.getElementById("applicationMessageBox");

    e.preventDefault();

    const applicationsCollection = collection(firestoreDB, "applications");
    const cvFile = applicationForm.querySelector('#cv').files[0];

    const newApplicationData = {
      name: applicationForm.querySelector('#name').value,
      email: applicationForm.querySelector('#email').value,
      message: applicationForm.querySelector('#message').value,
    };

    var applicationDocRef;
    try {
      const docRef = await addDoc(applicationsCollection, newApplicationData);
      applicationDocRef=docRef;
      console.log("Document written with ID: ", docRef.id);

      if (cvFile) {
        const storageRef = ref(storage, "cv_files/" + docRef.id + "-" + cvFile.name);
        const cvSnapshot = await uploadBytes(storageRef, cvFile);

        const cvUrl = await getDownloadURL(cvSnapshot.ref);
        newApplicationData.cvUrl = cvUrl;
      }

      messageBox.textContent = "Application submitted successfully.";
      applicationForm.reset();

    } catch (error) {
      console.error("Error adding application: ", error);
      messageBox.textContent = "Error submitting application.";
    }

    const storedJobDetails = localStorage.getItem('jobDetails');
    if (storedJobDetails) {
        const jobDetails = JSON.parse(storedJobDetails);
        // Adaugam referinta catre aplicatie la jobul curent
        const selectedJobContainer = document.querySelector('.selected-job-container');

        const jobDocRef = doc(firestoreDB, "jobs", jobDetails.jobId);

        try {
        await updateDoc(jobDocRef, {
            applicants: arrayUnion(applicationDocRef)
        });

        console.log("Application added to the job's applicant list.");
        messageBox.textContent = "Application submitted successfully.";
        applicationForm.reset();
        } catch (error) {
        console.error("Error adding application to job: ", error);
        messageBox.textContent = "Error submitting application.";
        }
    }
  });
}

// Funcția pentru aplicarea rapidă a unui job
async function applyForJobQuickly(jobId) {
    const applicationsCollection = collection(firestoreDB, "applications");
    
    const user = auth.currentUser;
    const displayName = user.displayName;
    const email = user.email;
    
    const newApplicationData = {
      name: displayName,
      email: email,
      message: "Aplicare rapidă", 
    };
    
    try {
      const docRef = await addDoc(applicationsCollection, newApplicationData);
      console.log("Document written with ID: ", docRef.id);
    
      // Adaugă referința către aplicație la jobul curent
      const jobDocRef = doc(firestoreDB, "jobs", jobId);
      await updateDoc(jobDocRef, {
        applicants: arrayUnion(docRef)
      });
    


      console.log("Application added to the job's applicant list.");
    
    } catch (error) {
      console.error("Error adding application: ", error);
    }
  }
  
// Funcție pentru asocierea evenimentului de click cu butonul "Aplica rapid"
function attachQuickApplyEvent() {
    const quickApplyButton = document.querySelector('#quickApplyButton');
    if (quickApplyButton) {
        quickApplyButton.addEventListener('click', async () => {
            const storedJobDetails = localStorage.getItem('jobDetails');
            if (storedJobDetails) {
                const jobDetails = JSON.parse(storedJobDetails);
                await applyForJobQuickly(jobDetails.jobId);

                quickApplyButton.textContent = "Ai aplicat deja";
                quickApplyButton.disabled = true;
                quickApplyButton.classList.add("btn-disabled");
                console.log("Quick application submitted successfully.");
            } else {
                console.error("Error: No job details found.");
            }
        });
    }
}

// Asigură-te că DOM-ul este complet încărcat înainte de a apela funcția de atașare a evenimentului
document.addEventListener('DOMContentLoaded', attachQuickApplyEvent);