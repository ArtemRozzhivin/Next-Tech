'use client';

import { FaceFrownIcon } from '@heroicons/react/24/outline';
import PagePlaceholder from '@src/components/PagePlaceholder';
import ProductsList from '@src/components/Product/List';
import { useAppSelector } from '@src/redux/hooks';
import React from 'react';

const Wishlist = () => {
  const userHistory = useAppSelector((state) => state.products.userHistory);

  return (
    <div className='flex flex-col gap-5'>
      <h2 className='font-semibold text-2xl'>Ваш список бажань</h2>
      {!!userHistory?.wishlist?.length ? (
        <ProductsList items={userHistory?.wishlist} />
      ) : (
        <PagePlaceholder
          icon={<FaceFrownIcon className='w-10 h-10 text-colorMain' />}
          title='No products found'
          description='No products found, please reload the page'
        />
      )}
    </div>
  );
};

export default Wishlist;
