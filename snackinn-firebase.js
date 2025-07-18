import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDh1oEETtqBF6CxzJzAGJKP7TttLRIFlEg",
  authDomain: "snackinn-979a8.firebaseapp.com",
  projectId: "snackinn-979a8",
  storageBucket: "snackinn-979a8.firebasestorage.app",
  messagingSenderId: "929490643698",
  appId: "1:929490643698:web:4d7a87897863c38f883e6b",
  measurementId: "G-54KKTHQYJQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
