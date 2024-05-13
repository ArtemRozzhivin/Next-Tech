'use client';

import { FaceFrownIcon } from '@heroicons/react/24/outline';
import OrderedProductItem from '@src/components/Ordering/ProductItem';
import PagePlaceholder from '@src/components/PagePlaceholder';
import { useAppSelector } from '@src/redux/hooks';
import { IOrderedItem } from '@src/redux/models';
import React, { useEffect, useState } from 'react';

const Purchases = () => {
  const userHistory = useAppSelector((state) => state.products.userHistory);
  const user = useAppSelector((state) => state.auth.user);
  const [sortedPurchases, setSortedPurchases] = useState<IOrderedItem[] | null>(null);

  const sortByDate = (arr: IOrderedItem[]): IOrderedItem[] => {
    return [...arr].sort((a, b) => b.date - a.date);
  };

  useEffect(() => {
    if (!userHistory?.purchases) return;
    setSortedPurchases(sortByDate(userHistory.purchases));
  }, []);

  return (
    <div className='p-2 flex flex-col gap-5'>
      <h2 className='text-3xl font-semibold'>Мої замовлення</h2>
      {sortedPurchases ? (
        <div className='flex flex-col gap-5'>
          {sortedPurchases?.map((purchase) => (
            <OrderedProductItem
              key={purchase.product.id + purchase.date}
              email={user?.email ?? ''}
              purchase={purchase}
            />
          ))}
        </div>
      ) : (
        <PagePlaceholder
          icon={<FaceFrownIcon className='w-10 h-10 text-colorMain' />}
          title='Не знайдено жодного товару'
          description='Можливо, ви ще не придбали жодного товару?'
        />
      )}
    </div>
  );
};

export default Purchases;
