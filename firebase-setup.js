// Import the Firebase SDKs (use the CDN URLs from your console)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";

// Your Firebase configuration (copy this from your Firebase console!)
const firebaseConfig = {

    apiKey: "AIzaSyDp29hYUnk-AScwLtO3RiDIuJ1zyr0UCN0",

    authDomain: "anthony-base.firebaseapp.com",

    projectId: "anthony-base",

    storageBucket: "anthony-base.firebasestorage.app",

    messagingSenderId: "167219962137",

    appId: "1:167219962137:web:6d37d0ff6405107a8c2588",

    measurementId: "G-374HM80ZKP"

  };


// Initialize Firebase & Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Grab HTML elements
const loginBtn = document.getElementById('login-btn');
const userProfile = document.getElementById('user-profile');
const userName = document.getElementById('user-name');

// Handle button click
loginBtn.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      // Show user name and hide login button
      loginBtn.style.display = 'none';
      userProfile.style.display = 'block';
      userName.innerText = user.displayName;
    })
    .catch((error) => {
      console.error("Login failed: ", error);
    });
});

