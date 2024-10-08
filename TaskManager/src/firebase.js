// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getDatabase } from "firebase/database";  // Import Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA270UmSGy1RHoSSblxO43u386MuxCFpdE",
  authDomain: "task-manager-b67d4.firebaseapp.com",
  databaseURL: 'https://task-manager-b67d4-default-rtdb.asia-southeast1.firebasedatabase.app', 
  projectId: "task-manager-b67d4",
  storageBucket: "task-manager-b67d4.appspot.com",
  messagingSenderId: "772239394828",
  appId: "1:772239394828:web:d187edac5c2d8eb6ae0629"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);  // Initialize Realtime Database

// Function to handle Google Sign-In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log('User Info:', user);
    console.log('Token:', token);
  } catch (error) {
    console.error('Error during sign-in:', error);
  }
};

// Function to handle Sign-Out
export const logout = async () => {
  try {
    await signOut(auth);
    console.log('User signed out');
  } catch (error) {
    console.error('Error during sign-out:', error);
  }
};

export { auth, db };  // Export the database reference
