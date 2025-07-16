import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ✅ Firebase config
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

// ✅ Register
window.snackRegister = function (email, password, name = "User") {
  return createUserWithEmailAndPassword(auth, email, password).then(userCredential => {
    const user = userCredential.user;
    return updateProfile(user, { displayName: name });
  });
};

// ✅ Login
window.snackLogin = function (email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      const user = userCredential.user;
      // ✅ Save UID to localStorage for dashboard access
      localStorage.setItem("snack_user", JSON.stringify({ uid: user.uid }));
      return userCredential;
    })
    .catch(err => {
      throw err;
    });
};

// ✅ Logout
window.logoutUser = function () {
  return signOut(auth).then(() => {
    location.reload();
  });
};

// 🔁 Watch for login/logout
onAuthStateChanged(auth, user => {
  const welcome = document.getElementById("user-welcome");
  const mobileWelcome = document.getElementById("mobile-user-welcome");

  if (welcome && mobileWelcome) {
    if (user) {
      const name = user.displayName || "User";
      welcome.textContent = `Welcome, ${name}`;
      mobileWelcome.textContent = `Welcome, ${name}`;
      welcome.classList.remove("hidden");
      mobileWelcome.classList.remove("hidden");

      document.getElementById("login-btn")?.classList.add("hidden");
      document.getElementById("mobile-login-btn")?.classList.add("hidden");
      document.getElementById("mobile-register-btn")?.classList.add("hidden");

      document.getElementById("logout-btn")?.classList.remove("hidden");
      document.getElementById("mobile-logout-btn")?.classList.remove("hidden");
    } else {
      welcome.classList.add("hidden");
      mobileWelcome.classList.add("hidden");

      document.getElementById("login-btn")?.classList.remove("hidden");
      document.getElementById("mobile-login-btn")?.classList.remove("hidden");
      document.getElementById("mobile-register-btn")?.classList.remove("hidden");

      document.getElementById("logout-btn")?.classList.add("hidden");
      document.getElementById("mobile-logout-btn")?.classList.add("hidden");
    }
  }
});

// 🔐 Handle login
document.getElementById("login-form")?.addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    await snackLogin(email, password);
    document.getElementById("login-modal").classList.add("hidden");
    console.log("Login successful");
  } catch (err) {
    alert("Login failed: " + err.message);
  }
});

// 🧡 Handle register
document.getElementById("register-form")?.addEventListener("submit", async e => {
  e.preventDefault();

  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const phone = document.getElementById("register-phone")?.value.trim(); // optional
  const password = document.getElementById("register-password").value;
  const confirm = document.getElementById("register-confirm").value;

  if (password !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  try {
    await snackRegister(email, password, name);
    alert("Account created successfully!");
    document.getElementById("register-modal").classList.add("hidden");
    document.getElementById("login-modal").classList.remove("hidden");
  } catch (err) {
    alert("Registration failed: " + err.message);
  }
});

// 🎛 Open Login Modal
document.getElementById("login-btn")?.addEventListener("click", () => {
  document.getElementById("login-modal").classList.remove("hidden");
});
document.getElementById("mobile-login-btn")?.addEventListener("click", () => {
  document.getElementById("mobile-menu")?.classList.add("hidden");
  document.getElementById("login-modal").classList.remove("hidden");
});

// 🎛 Open Register Modal
document.getElementById("mobile-register-btn")?.addEventListener("click", () => {
  document.getElementById("mobile-menu")?.classList.add("hidden");
  document.getElementById("register-modal").classList.remove("hidden");
});

// ❌ Close Modals
document.getElementById("close-login")?.addEventListener("click", () => {
  document.getElementById("login-modal").classList.add("hidden");
});
document.getElementById("close-register")?.addEventListener("click", () => {
  document.getElementById("register-modal").classList.add("hidden");
});

// 🔁 Toggle Login/Register
document.getElementById("show-register")?.addEventListener("click", () => {
  document.getElementById("login-modal").classList.add("hidden");
  document.getElementById("register-modal").classList.remove("hidden");
});
document.getElementById("show-login")?.addEventListener("click", () => {
  document.getElementById("register-modal").classList.add("hidden");
  document.getElementById("login-modal").classList.remove("hidden");
});
