'use client';

import ProductCard from '@src/components/ProductCard';
import { db } from '@src/firebaseConfig';
import Input from '@src/ui/Input';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import PagePlaceholder from '../PagePlaceholder';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

export interface IProductItem {
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

interface ICardList {
  items?: IProductItem[];
}

const CardList = ({ items }: ICardList) => {
  return (
    <div className='p-10'>
      <div className='grid grid-cols-4 grid-rows-3 gap-3'>
        {!!items ? (
          items.map(({ product, image }) => (
            <ProductCard key={product.model} model={product.model} image={image} />
          ))
        ) : (
          <PagePlaceholder
            icon={<FaceFrownIcon className='w-10 h-10 text-colorMain' />}
            title='No products found'
            description='No products found, please reload the page'
          />
        )}
      </div>
    </div>
  );
};

export default CardList;
