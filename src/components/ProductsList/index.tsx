'use client';

import ProductCard from '@src/components/ProductCard';
import { db } from '@src/firebaseConfig';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import React, { useEffect } from 'react';

const CardList = () => {
  return (
    <div>
      <ProductCard />
    </div>
  );
};

export default CardList;
