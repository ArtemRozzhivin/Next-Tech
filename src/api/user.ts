'use client';

import { db } from '@src/firebaseConfig';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const addUserHistory = async (user: string) => {
  const userRef = doc(db, 'users', user);
  await setDoc(userRef, { id: user }, { merge: true });
};

export const getUserHistory = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  return userSnap.data();
};
