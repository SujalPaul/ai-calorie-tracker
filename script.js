import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const uploadBox = document.getElementById("uploadBox");
const foodImage = document.getElementById("foodImage");
const foodInput = document.getElementById("foodInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultContainer = document.getElementById("resultContainer");
const recentList = document.getElementById("recentList");

const totalCalories = document.getElementById("totalCalories");
const mealsCount = document.getElementById("mealsCount");
const remainingCalories = document.getElementById("remainingCalories");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");

const authModal = document.getElementById("authModal");
const authTitle = document.getElementById("authTitle");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authSubmit = document.getElementById("authSubmit");
const switchAuth = document.getElementById("switchAuth");

const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");

let selectedImage = null;
let isLogin = true;
let currentUser = null;

const DAILY_GOAL = 2000;

uploadBox.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    selectedImage = file;

    const reader = new FileReader();

    reader.onload = () => {
      foodImage.src = reader.result;
      foodImage.style.display = "block";
    };

    reader.readAsDataURL(file);
  };

  input.click();
});

switchAuth.addEventListener("click", () => {
  isLogin = !isLogin;

  authTitle.innerText = isLogin ? "Login" : "Create Account";
  authSubmit.innerText = isLogin ? "Login" : "Signup";

  switchAuth.innerHTML = isLogin
    ? `Don't have an account? <span>Signup</span>`
    : `Already have an account? <span>Login</span>`;
});

authSubmit.addEventListener("click", async () => {
  const email = authEmail.value;
  const password = authPassword.value;

  try {
    if (isLogin) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      await createUserWithEmailAndPassword(auth, email, password);
    }

    authModal.style.display = "none";
  } catch (err) {
    alert(err.message);
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;

    authModal.style.display = "none";

    userName.innerText = user.email.split("@")[0];

    loadHistory();
  } else {
    authModal.style.display = "flex";
  }
});

analyzeBtn.addEventListener("click", async () => {
  const food = foodInput.value.trim();

  if (!food) {
    alert("Enter food name");
    return;
  }

  analyzeBtn.innerHTML = `
    <div class="loader"></div>
  `;

  analyzeBtn.disabled = true;

  setTimeout(async () => {
    const calories = Math.floor(Math.random() * 400) + 150;
    const protein = Math.floor(Math.random() * 20) + 5;
    const carbs = Math.floor(Math.random() * 60) + 10;
    const fat = Math.floor(Math.random() * 20) + 2;

    renderResult(food, calories, protein, carbs, fat);

    await saveMeal(food, calories, protein, carbs, fat);

    analyzeBtn.innerHTML = "Analyze Nutrition";
    analyzeBtn.disabled = false;
  }, 1800);
});

function renderResult(food, calories, protein, carbs, fat) {
  resultContainer.innerHTML = `
    <div class="nutrition-card fade-in">
      <h2>🍜 ${capitalize(food)}</h2>

      <div class="calorie-circle">
        <h1>${calories}</h1>
        <span>kcal</span>
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
}

async function saveMeal(food, calories, protein, carbs, fat) {
  if (!currentUser) return;

  await addDoc(collection(db, "meals"), {
    uid: currentUser.uid,
    food,
    calories,
    protein,
    carbs,
    fat,
    createdAt: serverTimestamp()
  });

  loadHistory();
}

async function loadHistory() {
  if (!currentUser) return;

  const q = query(
    collection(db, "meals"),
    where("uid", "==", currentUser.uid)
  );

  const querySnapshot = await getDocs(q);

  recentList.innerHTML = "";

  let total = 0;
  let meals = 0;

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    meals++;
    total += data.calories;

    recentList.innerHTML += `
      <div class="history-card">
        <h4>🍱 ${capitalize(data.food)}</h4>
        <p>${data.calories} kcal</p>
      </div>
    `;
  });

  totalCalories.innerText = total;
  mealsCount.innerText = meals;

  const remaining = DAILY_GOAL - total;

  remainingCalories.innerText = remaining > 0 ? remaining : 0;

  const progress = Math.min((total / DAILY_GOAL) * 100, 100);

  progressText.innerText = `${Math.floor(progress)}%`;

  progressBar.style.width = `${progress}%`;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
