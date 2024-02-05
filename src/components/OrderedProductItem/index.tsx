'use client';

import { IOrderedItem } from '@src/redux/models';
import ProductOrderingItem from '../ProductOrderingItem';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import OrderedInfoBlock from '../OrderedInfoBlock';

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
    <button
      onClick={() => setIsInfoOpen((prevState) => !prevState)}
      className='rounded-md shadow-xl p-5 bg-lightmain'>
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

      <div className='flex flex-col gap-5'>
        {isInfoOpen && (
          <div className='flex flex-col gap-5'>
            <div className='flex justify-start'>
              <OrderedInfoBlock
                title='Спосіб доставки'
                text={purchase.info.method}
                textExtractor={(text) => transformDeliveryMethod(text)}
              />
            </div>

            <div className='flex items-center gap-10'>
              <OrderedInfoBlock title='Місто' text={purchase.info.city.Present} />

              <OrderedInfoBlock
                title='Адреса'
                text={purchase.info.address.Description}
                textExtractor={() => {
                  if (purchase.info.method === 'to-nova-poshta-office') {
                    return <div>{purchase.info.address.Description}</div>;
                  }

                  return <div>{purchase.info.address.Present}</div>;
                }}
              />
            </div>

            <div className='flex items-center gap-10'>
              <OrderedInfoBlock
                title="Прізвище Ім'я По-батькові"
                text={`${purchase.info.lastName} ${purchase.info.firstName} ${purchase.info.patronymic}`}
              />
              <OrderedInfoBlock title='Електронна пошта' text={email} />

              <OrderedInfoBlock title='Номер телефону' text={purchase.info.phone} />
            </div>
          </div>
        )}

        <ProductOrderingItem
          count={purchase.count}
          image={purchase.image}
          product={purchase.product}
        />
      </div>
    </button>
  );
};

export default OrderedProductItem;
