// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, onValue, set, push, update, remove } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCeCcjJeD2NJc0d9sdKZUsLwxEwd6iGKZQ",
  authDomain: "lichnov-pokladna.firebaseapp.com",
  databaseURL: "https://lichnov-pokladna-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lichnov-pokladna",
  storageBucket: "lichnov-pokladna.firebasestorage.app",
  messagingSenderId: "982540085536",
  appId: "1:982540085536:web:4b3691b53e8955bc70cf45",
  measurementId: "G-R3529FJ2WX"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, set, push, update, remove };
