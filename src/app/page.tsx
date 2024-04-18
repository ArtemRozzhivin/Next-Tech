'use client';

import Categories from '@src/components/Categories';
import { auth, db } from '@src/firebaseConfig';
import { useAppDispatch } from '@src/redux/hooks';
import Input from '@src/ui/Input';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { authActions } from '@redux/reducers/auth';
import { addUserHistory, getUserHistory } from '@src/api/user';
import { IUserHistory, productsActions } from '@src/redux/reducers/Products/products';
import { fetchproductToFireBase } from '@src/utils/fetchProductToFirebase';

export default function Home() {
  const dispatch = useAppDispatch();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      getUserHistory(user).then((userHistory) => {
        console.log(userHistory);
        if (userHistory) dispatch(productsActions.setUserHistory(userHistory));
      });

      dispatch(authActions.setUser(user));
    } else {
      dispatch(authActions.logout());
    }
  });

  return (
    <main className='px-10'>
      <Categories />
    </main>
  );
}
