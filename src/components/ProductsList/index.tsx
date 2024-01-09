'use client';

import ProductCard from '@src/components/ProductCard';
import { db } from '@src/firebaseConfig';
import Input from '@src/ui/Input';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

interface IProductItem {
  image: {
    large: string;
    thumbnail?: string;
    back: string | null;
    front: string | null;
  };
  product: {
    id: string;
    category: string;
    model: string;
    brand: string;
    version: string;
  };
}

const CardList = () => {
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

      setLaptops(dataArray);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  console.log(laptops);

  useEffect(() => {
    fetchLaptops();
    // fetchTablets();
  }, []);

  return (
    <div className='p-10'>
      <div className='grid grid-cols-4 grid-rows-3 gap-3'>
        {!!laptops &&
          laptops.map(({ product, image }) => (
            <ProductCard key={product.model} model={product.model} image={image.large} />
          ))}
      </div>
    </div>
  );
};

export default CardList;
