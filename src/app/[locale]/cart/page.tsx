'use client';

import React from 'react';
import { ArrowLongLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import ProductCartItem from '@src/components/ProductCartItem';
import { useAppSelector } from '@src/redux/hooks';

const Cart = () => {
  const { cartProducts, cartProductsCount } = useAppSelector((state) => state.products);

  return (
    <div>
      <div className='flex items-center gap-2'>
        <ArrowLongLeftIcon className='w-10 h-10' />
        <h2>Кошик</h2>
        {!!cartProductsCount ? <div>{cartProductsCount} товарів</div> : ''}
      </div>

      <div className='bg-lightmain p-5 flex justify-start items-center gap-5'>
        <TrashIcon className='w-5 h-5' />
        <div>Очистити кошик</div>
      </div>
      <div className='px-2 py-4 flex flex-col gap-3 justify-center items-center'>
        {cartProducts.map((item) => (
          <ProductCartItem key={item.product.model} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Cart;
