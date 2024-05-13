import { db } from '@src/firebaseConfig';
import { User } from '@src/models/user';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const addUserHistory = async (userId: string) => {
  const userRef = doc(db, 'users', userId);

  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, { id: userId }, { merge: true });

    return;
  }
};

export const getUserHistory = async (user: User) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  return userSnap.data();
};
