'use client';

import { db } from '@src/firebaseConfig';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import Button from '@src/ui/Button';
import Image from 'next/image';
import { IProductItem } from '@src/redux/models';
import { useAppDispatch } from '@src/redux/hooks';
import { productsActions } from '@src/redux/reducers/products';

const ProductItem = ({ product, image }: IProductItem) => {
  const dispatch = useAppDispatch();

  const addToCart = async () => {
    const item = {
      product,
      image,
      count: 1,
    };

    dispatch(productsActions.addToCart(item));
  };

  return (
    <div>
      <div className='group border-gray-100/30 flex w-full flex-col self-center overflow-hidden rounded-lg border bg-darkmain shadow-md'>
        <div className='bg-white relative m-3 flex h-60 overflow-hidden rounded-sm'>
          <Image
            className='peer absolute top-0 right-0 h-full w-full object-contain'
            fill
            src={image.large ? image.large : image.front}
            alt='product'
          />
          {image.back && (
            <Image
              className='peer peer-hover:right-0 absolute top-0 -right-96 h-full w-full object-contain transition-all delay-100 duration-500 hover:right-0'
              fill
              src={image.back}
              alt='product'
            />
          )}
          <button>
            <HeartIcon className='text-colorMain w-8 h-8 absolute right-2 top-2' />
          </button>
        </div>
        <div className='mt-4 px-5 pb-5'>
          <a href='#'>
            <h5 className='text-xl tracking-tight text-lightmain'>{product.model}</h5>
          </a>
          <div className='mt-2 mb-5 flex items-center justify-between'>
            <p>
              <span className='text-xl font-semibold text-lightmain'>{product.price} ₴</span>
            </p>
          </div>
          <Button
            primary
            onClick={addToCart}
            className='w-full rounded-md border border-transparent bg-colorMain px-5 py-2.5 text-sm font-medium text-white'>
            <div className='w-full text-center flex items-center justify-center gap-2'>
              <ShoppingCartIcon className='w-6 h-6' />
              Add to cart
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
