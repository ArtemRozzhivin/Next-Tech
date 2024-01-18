'use client';

import Categories from '@src/components/Categories';
import CardList from '@src/components/ProductsList';
import { auth } from '@src/firebaseConfig';
import { useAppDispatch } from '@src/redux/hooks';
import Input from '@src/ui/Input';
import { onAuthStateChanged } from 'firebase/auth';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { authActions } from '@redux/reducers/auth';

export default function Home() {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  onAuthStateChanged(auth, (user) => {
    if (user) {
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
