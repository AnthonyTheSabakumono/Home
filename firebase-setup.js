// ── Firebase init ────────────────────────────────────────────────
// This file is the ONE place your Firebase config and auth/db
// instances live. Every other page (profile.html, leaderboard.html,
// weekly-test.html) imports `auth` and `db` from here instead of
// re-initializing Firebase itself.
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDp29hYUnk-AScwLtO3RiDIuJ1zyr0UCN0",
  authDomain: "anthony-base.firebaseapp.com",
  projectId: "anthony-base",
  storageBucket: "anthony-base.firebasestorage.app",
  messagingSenderId: "167219962137",
  appId: "1:167219962137:web:6d37d0ff6405107a8c2588",
  measurementId: "G-374HM80ZKP"
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

const provider = new GoogleAuthProvider();

// ── Header UI wiring ─────────────────────────────────────────────
// Every page that includes this script is expected to have the same
// header markup: #auth-btn, #user-chip, #user-avatar, #user-name.
// Optional chaining (?.) so a page missing one of these doesn't throw.
const authBtn    = document.getElementById('auth-btn');
const userChip   = document.getElementById('user-chip');
const userAvatar = document.getElementById('user-avatar');
const userName   = document.getElementById('user-name');

authBtn?.addEventListener('click', () => {
  signInWithPopup(auth, provider).catch((error) => {
    console.error("Login failed: ", error);
  });
});

window.signOutUser = () => {
  signOut(auth).catch((error) => console.error("Sign-out failed: ", error));
};

// ── Profile doc creation (Step 2 of the plan) ───────────────────
// Runs every time auth state resolves (page load, sign-in, sign-out).
// Only ever writes displayName/photoURL/email/joinedAt — never
// totalPoints, which the Firestore rules would reject anyway.
async function ensureUserProfile(user) {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await setDoc(userRef, {
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      email: user.email || '',
      joinedAt: serverTimestamp()
    });
  } else {
    // Keep name/photo fresh if their Google profile changed since last visit
    await setDoc(userRef, {
      displayName: user.displayName || '',
      photoURL: user.photoURL || ''
    }, { merge: true });
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (authBtn)  authBtn.style.display = 'none';
    if (userChip) userChip.style.display = 'flex';
    if (userAvatar) userAvatar.src = user.photoURL || '';
    if (userName) userName.textContent = user.displayName || user.email;

    ensureUserProfile(user).catch((err) => console.error("Profile sync failed:", err));
  } else {
    if (authBtn)  authBtn.style.display = 'flex';
    if (userChip) userChip.style.display = 'none';
  }
});

// Exposed so page-specific scripts (profile.html, weekly-test.html) can
// check "is someone signed in right now" without importing onAuthStateChanged
// themselves. Pages should still prefer onAuthStateChanged for anything
// that needs to react live to sign-in/out.
export function getCurrentUser() {
  return auth.currentUser;
}
