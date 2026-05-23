// FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAcisizgxdelge9Xv1erRd-8VZv3MPgdcs",
  authDomain: "nutrivisionai-b461f.firebaseapp.com",
  projectId: "nutrivisionai-b461f",
  storageBucket: "nutrivisionai-b461f.firebasestorage.app",
  messagingSenderId: "868203819952",
  appId: "1:868203819952:web:8e6d5c3537841360d2dc75",
  measurementId: "G-DTPBRMBNP7"
};

// INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM
const authModal = document.getElementById("authModal");
const authBtn = document.getElementById("authBtn");
const switchAuth = document.getElementById("switchAuth");
const switchText = document.getElementById("switchText");
const authTitle = document.getElementById("authTitle");

const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");

// LOGIN / SIGNUP TOGGLE
let isLogin = true;

switchAuth.addEventListener("click", () => {

  isLogin = !isLogin;

  if (isLogin) {

    authTitle.innerText = "Login";
    authBtn.innerText = "Login";
    switchText.innerText = "Don't have an account?";
    switchAuth.innerText = "Signup";

  } else {

    authTitle.innerText = "Signup";
    authBtn.innerText = "Create Account";
    switchText.innerText = "Already have an account?";
    switchAuth.innerText = "Login";

  }

});

// LOGIN / SIGNUP
authBtn.addEventListener("click", async () => {

  const email =
    document.getElementById("authEmail").value;

  const password =
    document.getElementById("authPassword").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {

    // LOGIN
    if (isLogin) {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    }

    // SIGNUP
    else {

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Account created successfully!");

    }

  } catch (error) {

    alert(error.message);

  }

});

// AUTH STATE
onAuthStateChanged(auth, (user) => {

  if (user) {

    authModal.style.display = "none";

    if (userName) {
      userName.innerText = user.email;
    }

  } else {

    authModal.style.display = "flex";

    if (userName) {
      userName.innerText = "Guest";
    }

  }

});

// LOGOUT
if (logoutBtn) {

  logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

  });

}

// ==========================
// FOOD ANALYSIS
// ==========================

const analyzeBtn =
  document.getElementById("analyzeBtn");

const foodInput =
  document.getElementById("foodInput");

const imageInput =
  document.getElementById("imageInput");

const foodPreview =
  document.getElementById("foodPreview");

const result =
  document.getElementById("result");

const historyList =
  document.getElementById("historyList");

let totalCalories = 0;
let meals = 0;

if (imageInput) {

  imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {

      foodPreview.src = e.target.result;

    };

    reader.readAsDataURL(file);

  });

}

if (analyzeBtn) {

  analyzeBtn.addEventListener("click", async () => {

    const food =
      foodInput.value.trim();

    if (!food) {
      alert("Enter food name");
      return;
    }

    analyzeBtn.innerText = "Analyzing...";
    analyzeBtn.disabled = true;

    try {

      // DEMO DATA
      const calories =
        Math.floor(Math.random() * 500) + 100;

      const protein =
        Math.floor(Math.random() * 30) + 1;

      const carbs =
        Math.floor(Math.random() * 60) + 1;

      const fat =
        Math.floor(Math.random() * 20) + 1;

      result.innerHTML = `
      
      <div class="nutrition-card">

        <h2>🍜 ${food}</h2>

        <div class="calorie-circle">
          <h1>${calories}</h1>
          <p>kcal</p>
        </div>

        <div class="macro-grid">

          <div class="macro-card">
            <span>💪 Protein</span>
            <h3>${protein}g</h3>
          </div>

          <div class="macro-card">
            <span>⚡ Carbs</span>
            <h3>${carbs}g</h3>
          </div>

          <div class="macro-card">
            <span>🥑 Fat</span>
            <h3>${fat}g</h3>
          </div>

        </div>

      </div>

      `;

      // HISTORY
      if (historyList) {

        const item =
          document.createElement("div");

        item.className = "history-item";

        item.innerHTML = `
          <strong>🍱 ${food}</strong>
          <p>${calories} kcal</p>
        `;

        historyList.prepend(item);

      }

      // DASHBOARD
      totalCalories += calories;
      meals++;

      updateDashboard();

    } catch (error) {

      result.innerHTML =
        `<p>Error analyzing food</p>`;

    }

    analyzeBtn.innerText =
      "Analyze Nutrition";

    analyzeBtn.disabled = false;

  });

}

// DASHBOARD
function updateDashboard() {

  const caloriesText =
    document.getElementById("totalCalories");

  const mealsText =
    document.getElementById("mealCount");

  const remainingText =
    document.getElementById("remainingCalories");

  const progressText =
    document.getElementById("progressPercent");

  const progressBar =
    document.getElementById("progressBar");

  const remaining =
    2000 - totalCalories;

  const progress =
    Math.min(
      (totalCalories / 2000) * 100,
      100
    );

  if (caloriesText)
    caloriesText.innerText =
      totalCalories;

  if (mealsText)
    mealsText.innerText =
      meals;

  if (remainingText)
    remainingText.innerText =
      remaining;

  if (progressText)
    progressText.innerText =
      `${Math.floor(progress)}%`;

  if (progressBar)
    progressBar.style.width =
      `${progress}%`;

}
