'use client';

import { FaceFrownIcon } from '@heroicons/react/24/outline';
import OrderedProductItem from '@src/components/OrderedProductItem';
import PagePlaceholder from '@src/components/PagePlaceholder';
import ProductOrderingItem from '@src/components/ProductOrderingItem';
import { useAppSelector } from '@src/redux/hooks';
import React, { use } from 'react';

const Purchases = () => {
  const userHistory = useAppSelector((state) => state.products.userHistory);
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div>
      <h2>Мої замовлення</h2>
      {!!userHistory?.purchases?.length ? (
        <div className='flex flex-col gap-5'>
          {userHistory.purchases?.map((purchase) => (
            <OrderedProductItem email={user?.email} purchase={purchase} />
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
