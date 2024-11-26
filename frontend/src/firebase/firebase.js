// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkT3VEvKQgGLwG06gzfaFxhMVHOT0pSGs",
  authDomain: "netdetect-dbe76.firebaseapp.com",
  projectId: "netdetect-dbe76",
  storageBucket: "netdetect-dbe76.firebasestorage.app",
  messagingSenderId: "493274906193",
  appId: "1:493274906193:web:8ece792cc333e73fbd4270",
  measurementId: "G-JHSPXDXMDW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const analytics = getAnalytics(app);
export default app;
