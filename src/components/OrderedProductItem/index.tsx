'use client';

import { IOrderedItem } from '@src/redux/models';
import ProductOrderingItem from '../ProductOrderingItem';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface IProductOrderingItem {
  purchase: IOrderedItem;
  email: string;
}

const OrderedProductItem = ({ purchase, email }: IProductOrderingItem) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const transformDeliveryMethod = (methodId: string) => {
    switch (methodId) {
      case 'courier-nova-poshta':
        return 'Кур’єр Нова Пошта';
      case 'courier-comfy':
        return "Кур'єр Comfy";
      case 'to-nova-poshta-office':
        return 'Поштомат або відділення Нова Пошта';
      default:
        return '';
    }
  };

  return (
    <button onClick={() => setIsInfoOpen((prevState) => !prevState)} className='p-5 bg-lightmain'>
      <div className='flex justify-end'>
        {isInfoOpen ? (
          <div className='flex items-center gap-1'>
            Згорнути <ChevronUpIcon className='w-6 h-6' />
          </div>
        ) : (
          <div className='flex items-center gap-1'>
            Детальніше <ChevronDownIcon className='w-6 h-6' />
          </div>
        )}
      </div>

      {isInfoOpen && (
        <div className='flex flex-col gap-5'>
          <div className='flex justify-start'>
            <div>
              <div>Спосіб доставки</div>
              <div>{transformDeliveryMethod(purchase.info.method)}</div>
            </div>
          </div>

          <div className='flex items-center gap-10'>
            <div>
              <div>Місто</div>
              <div>{purchase.info.city.Present}</div>
            </div>
            <div>
              <div>Адреса</div>
              {purchase.info.method === 'to-nova-poshta-office' ? (
                <div>{purchase.info.address.Description}</div>
              ) : (
                <div>{purchase.info.address.Present}</div>
              )}
            </div>
          </div>

          <div className='flex items-center gap-10'>
            <div>
              <div>Прізвище Ім'я По-батькові</div>
              <div>
                {purchase.info.lastName} {purchase.info.firstName} {purchase.info.patronymic}
              </div>
            </div>
            <div>
              <div>Електронна пошта</div>
              <div>{email}</div>
            </div>

            <div>
              <div>Телефон</div>
              <div>{purchase.info.phone}</div>
            </div>
          </div>
        </div>
      )}

      <ProductOrderingItem
        count={purchase.count}
        image={purchase.image}
        product={purchase.product}
      />
    </button>
  );
};

export default OrderedProductItem;
