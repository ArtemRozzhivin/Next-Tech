'use client';

import { FaceFrownIcon } from '@heroicons/react/24/outline';
import OrderedProductItem from '@src/components/Ordering/ProductItem';
import PagePlaceholder from '@src/components/PagePlaceholder';
import { useAppSelector } from '@src/redux/hooks';
import React, { use } from 'react';

const Purchases = () => {
  const userHistory = useAppSelector((state) => state.products.userHistory);
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className='p-2 flex flex-col gap-5'>
      <h2 className='text-3xl font-semibold'>Мої замовлення</h2>
      {!!userHistory?.purchases?.length ? (
        <div className='flex flex-col gap-5'>
          {userHistory.purchases?.map((purchase) => (
            <OrderedProductItem key={purchase.product.id} email={user?.email} purchase={purchase} />
          ))}
        </div>
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

export default Purchases;
