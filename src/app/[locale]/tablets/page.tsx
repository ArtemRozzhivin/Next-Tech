'use client';

import ProductPage from '@src/components/ProductPage';
import CardList, { IProductItem } from '@src/components/ProductsList';
import { db } from '@src/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

const Tablets = () => {
  const [tablets, setTablets] = useState<IProductItem[]>([]);

  const fetchTablets = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tablets'));
      const productsArray = [];

      const dataArray = querySnapshot.docs.map((doc) => doc.data());

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        productsArray.push(doc.data());
      });

      setTablets(dataArray as IProductItem[]);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchTablets();
    // fetchTablets();
  }, []);

  return (
    <div>
      <ProductPage title={'Tablets'}>
        <CardList items={tablets} />
      </ProductPage>
    </div>
  );
};

export default Tablets;
