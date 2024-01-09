// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { getStorage, ref } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyADt6ad6jftwhdQZSTtI8ugDY8blpmconU',
  authDomain: 'nexttech-e8ed2.firebaseapp.com',
  projectId: 'nexttech-e8ed2',
  storageBucket: 'nexttech-e8ed2.appspot.com',
  messagingSenderId: '868976487692',
  appId: '1:868976487692:web:5cfb2efa5337763d872d29',
  measurementId: 'G-7W8YK2BMSF',
};

export const signup = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signin = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

export const loginWithGoogle = () => {
  const googleProvide = new GoogleAuthProvider();
  return signInWithPopup(auth, googleProvide);
};

// Initialize Firebase

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, firebaseApp, storage, ref };
