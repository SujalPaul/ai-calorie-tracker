import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcisizgxdelge9Xv1erRd-8VZv3MPgdcs",
  authDomain: "nutrivisionai-b461f.firebaseapp.com",
  projectId: "nutrivisionai-b461f",
  storageBucket: "nutrivisionai-b461f.firebasestorage.app",
  messagingSenderId: "868203819952",
  appId: "1:868203819952:web:8e6d5c3537841360d2dc75",
  measurementId: "G-DTPBRMBNP7"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
