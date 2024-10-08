'use client';

import { IOrderedItem } from '@src/redux/models';
import ProductOrderingItem from '../Product/OrderingItem';
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import OrderedInfoBlock from './InfoBlock';

interface IProductOrderingItem {
  purchase: IOrderedItem;
  email: string;
}

const OrderingProductItem = ({ purchase, email }: IProductOrderingItem) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const transformDeliveryMethod = (methodId: string) => {
    switch (methodId) {
      case 'courier-nova-poshta':
        return 'Кур’єр Нова Пошта';
      case 'courier-next-tech':
        return "Кур'єр NextTech";
      case 'to-nova-poshta-office':
        return 'Поштомат або відділення Нова Пошта';
      default:
        return '';
    }
  };

  const transformPaymentMethod = (methodId: string) => {
    switch (methodId) {
      case 'payment-on-receipt':
        return 'Оплата при отриманні';
      case 'card-payment':
        return 'Оплата карткою';
      default:
        return '';
    }
  };

  return (
    <button
      onClick={() => setIsInfoOpen((prevState) => !prevState)}
      className='border border-gray-300 rounded-md shadow-sm hover:shadow-xl group p-5 bg-white transition-all'>
      <div className='flex items-center justify-between'>
        <div className='text-gray-500'>{new Date(purchase.date).toLocaleString()}</div>
        <div className='mb-4 md:mb-0 flex justify-end'>
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
      </div>

      <div className='flex flex-col gap-5'>
        <ProductOrderingItem
          count={purchase.count}
          image={purchase.image}
          product={purchase.product}
        />

        {isInfoOpen && (
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col justify-start gap-5'>
              <OrderedInfoBlock
                title='Спосіб доставки'
                text={purchase.info.method.id}
                textExtractor={(text) => transformDeliveryMethod(text)}
              />

              <OrderedInfoBlock
                title='Спосіб оплати'
                text={purchase.info.payment.id}
                textExtractor={(text) => transformPaymentMethod(text)}
              />
            </div>

            <div className='flex flex-col md:flex-row text-left md:items-center gap-5 md:gap-10'>
              {purchase.info.city?.Present && (
                <OrderedInfoBlock title='Місто' text={purchase.info.city?.Present} />
              )}

              <OrderedInfoBlock
                title='Адреса'
                text={purchase.info.address?.Description}
                textExtractor={() => {
                  if (purchase.info.method.type === 'courier') {
                    return <div>{purchase.info.address.Present}</div>;
                  }

                  return <div>{purchase.info.address.Description}</div>;
                }}
              />
            </div>

            <div className='flex flex-col md:flex-row text-start md:items-center gap-5 md:gap-10'>
              <OrderedInfoBlock
                title="Прізвище Ім'я По-батькові"
                text={`${purchase.info.lastName} ${purchase.info.firstName} ${purchase.info.patronymic}`}
              />
              <OrderedInfoBlock title='Електронна пошта' text={email} />

              <OrderedInfoBlock title='Номер телефону' text={purchase.info.phone} />
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

export default OrderingProductItem;
