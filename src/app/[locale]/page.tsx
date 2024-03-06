'use client';

import Categories from '@src/components/Categories';
import CardList from '@src/components/ProductsList';
import { auth, db } from '@src/firebaseConfig';
import { useAppDispatch } from '@src/redux/hooks';
import Input from '@src/ui/Input';
import { onAuthStateChanged } from 'firebase/auth';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { authActions } from '@redux/reducers/auth';
import { addUserHistory, getUserHistory } from '@src/api/user';
import { IUserHistory, productsActions } from '@src/redux/reducers/Products/products';
import { doc, getDoc } from 'firebase/firestore';
import { SearchBox } from 'react-instantsearch';
import { Search } from '@src/components/Search';
import { ToastContainer } from 'react-toastify';

export default function Home() {
  const t = useTranslations();
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
