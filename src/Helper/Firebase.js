import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyDE1pUFnD_wFnqawJEEFssFdssEfIUb8b0",
  authDomain: "shoppingcart-308b7.firebaseapp.com",
  projectId: "shoppingcart-308b7",
  storageBucket: "shoppingcart-308b7.appspot.com",
  messagingSenderId: "569607124568",
  appId: "1:569607124568:web:4a13846555d976562ebc2d",
  measurementId: "G-8LCZ3257V4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app);

export default db