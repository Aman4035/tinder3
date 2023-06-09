// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC74dW4M75mDCSkPKRkIfMEI_Utu1SEoXs",
  authDomain: "tinder2-52edd.firebaseapp.com",
  projectId: "tinder2-52edd",
  storageBucket: "tinder2-52edd.appspot.com",
  messagingSenderId: "644839056945",
  appId: "1:644839056945:web:23e053879f1d72a90a5710"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db }