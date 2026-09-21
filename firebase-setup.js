// Import the Firebase SDKs (CDN, matches your console's SDK version)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js"; // was pointed at firebase-analytics.js — auth exports don't live there

// Your Firebase configuration (from the Firebase console — project: anthony-base)
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

// Grab HTML elements (IDs match index.html's header markup)
const authBtn   = document.getElementById('auth-btn');
const userChip  = document.getElementById('user-chip');
const userAvatar = document.getElementById('user-avatar');
const userName  = document.getElementById('user-name');

// Handle sign-in button click
authBtn.addEventListener('click', () => {
  signInWithPopup(auth, provider).catch((error) => {
    console.error("Login failed: ", error);
  });
});

// Handle sign-out (called from the dropdown in index.html)
window.signOutUser = () => {
  signOut(auth).catch((error) => console.error("Sign-out failed: ", error));
};

// This is the fix for the "refresh and it forgets you're logged in" bug —
// Firebase already remembers the session, this just makes the UI agree with it.
// Runs once on page load AND every time sign-in/sign-out happens.
onAuthStateChanged(auth, (user) => {
  if (user) {
    authBtn.style.display = 'none';
    userChip.style.display = 'flex';
    userAvatar.src = user.photoURL || '';
    userName.textContent = user.displayName || user.email;

    // Hook point: this is where you create/update the users/{uid} Firestore
    // doc from the Phase 1 plan, once Firestore is wired in.
  } else {
    authBtn.style.display = 'flex';
    userChip.style.display = 'none';
  }
});
