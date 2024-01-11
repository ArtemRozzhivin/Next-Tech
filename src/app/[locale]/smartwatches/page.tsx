'use client';

import ProductPage from '@src/components/ProductPage';
import CardList, { IProductItem } from '@src/components/ProductsList';
import { db } from '@src/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

const Smartwatches = () => {
  const [smartwatches, setSmartwatches] = useState<IProductItem[]>([]);

  const fetchSmartwatches = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'smartwatches'));
      const productsArray = [];

      const dataArray = querySnapshot.docs.map((doc) => doc.data());

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        productsArray.push(doc.data());
      });

      setSmartwatches(dataArray as IProductItem[]);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchSmartwatches();
  }, []);

  return (
    <div>
      <ProductPage title={'Smartwatches'}>
        <CardList items={smartwatches} />
      </ProductPage>
    </div>
  );
};

export default Smartwatches;
