'use client';

import ProductPage from '@src/components/ProductPage';
import CardList, { IProductItem } from '@src/components/ProductsList';
import { db } from '@src/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

const Laptops = () => {
  const [laptops, setLaptops] = useState<IProductItem[]>([]);

  const fetchLaptops = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'laptops'));
      const productsArray = [];

      const dataArray = querySnapshot.docs.map((doc) => doc.data());

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        productsArray.push(doc.data());
      });

      setLaptops(dataArray as IProductItem[]);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchLaptops();
    // fetchTablets();
  }, []);

  return (
    <div>
      <ProductPage title={'Laptops'}>
        <CardList items={laptops} />
      </ProductPage>
    </div>
  );
};

export default Laptops;
