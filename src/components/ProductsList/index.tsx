'use client';

import ProductItem from '@src/components/ProductItem';
import { db } from '@src/firebaseConfig';
import Input from '@src/ui/Input';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import PagePlaceholder from '../PagePlaceholder';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { IProductItem } from '@src/redux/models';

interface ICardList {
  items?: IProductItem[];
}

const ProductsList = ({ items }: ICardList) => {
  return (
    <div className='p-10'>
      <div className='grid grid-cols-4  grid-rows-3 gap-3'>
        {!!items ? (
          items.map((item) => <ProductItem key={item.product.model} {...item} />)
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

export default ProductsList;
