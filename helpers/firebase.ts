import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase pour le projet terminal-d7af0
const firebaseConfig = {
  apiKey: "AIzaSyA-QAeiONqCX57jmvNiV6usu-ftllnHaIA",
  authDomain: "terminal-d7af0.firebaseapp.com",
  projectId: "terminal-d7af0",
  storageBucket: "terminal-d7af0.firebasestorage.app",
  messagingSenderId: "368550848867",
  appId: "1:368550848867:web:eeea30702312c7fbf5cb56",
  measurementId: "G-6H6265M4EL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
