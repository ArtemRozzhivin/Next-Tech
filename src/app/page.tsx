'use client';

import { auth } from '@src/firebaseConfig';
import { useAppDispatch } from '@src/redux/hooks';
import { onAuthStateChanged } from 'firebase/auth';
import { authActions } from '@redux/reducers/auth';
import { getUserHistory } from '@src/api/user';
import { productsActions } from '@src/redux/reducers/Products/products';
import Laptops from './laptops/page';
import { useEffect } from 'react';

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const loginedUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          metadata: {
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime,
          },
        };

        getUserHistory(loginedUser).then((userHistory) => {
          if (userHistory) dispatch(productsActions.setUserHistory(userHistory));
        });

        dispatch(authActions.setUser(loginedUser));
      } else {
        dispatch(authActions.logout());
      }
    });
  }, []);

  return (
    <main className='px-2 sm:px-5 lg:px-10'>
      <Laptops />
    </main>
  );
}
