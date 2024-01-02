'use client';

import { db } from '@src/firebaseConfig';
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect } from 'react';

const CardList = () => {
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, ' => ', doc.data());
    });
  };

  const fetchLapTops = async () => {
    const citiesRef = collection(db, 'products');

    // Create a query against the collection.
    const q = query(citiesRef, where('type', '==', 'Laptop'));

    return q;
  };

  useEffect(() => {
    // fetchProducts()
    fetchLapTops();
  }, []);

  return <div>CardList</div>;
};

export default CardList;
