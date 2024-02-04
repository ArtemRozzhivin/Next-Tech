import React, { ReactNode } from 'react';
import cx from 'clsx';
import Image from 'next/image';
import Input from '@src/ui/Input';

interface IDeliveryBlock {
  title: string;
  icon: string;
  currentDelivery: string;
  id: string;
  children: ReactNode;
  handleDelivery: (id: string) => void;
}

const DeliveryBlock = ({
  title,
  icon,
  children,
  currentDelivery,
  id,
  handleDelivery,
}: IDeliveryBlock) => {
  return (
    <button
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleDelivery(e.currentTarget.id)}
      id='courier-comfy'
      className='p-5 rounded-md border border-colorMain flex flex-col gap-5'>
      <div className='flex items-center gap-3'>
        <div className={cx('w-5 h-5 rounded-full border border-colorMain')}></div>
        <div className='flex items-center gap-3'>
          <div>{title}</div>
          <div>
            <Image
              width={65}
              height={65}
              src={icon}
              alt='delivery-icon'
              className='ogg-inline-tab__media-img'
            />
          </div>
        </div>
      </div>
      {currentDelivery === id && (
        <div className='flex flex-col gap-5'>
          <div className='flex items-center gap-5'>
            <Input
              name='email'
              type='text'
              label='Адреса доставки'
              // value={}
              placeholder='example@gmail.com'
              // onChange={handleInput}
            />
            <Input
              name='email'
              type='text'
              label='Будинок'
              // value={}
              placeholder='example@gmail.com'
              // onChange={handleInput}
            />
            <Input
              name='email'
              type='text'
              label='Квартира'
              // value={}
              placeholder='example@gmail.com'
              // onChange={handleInput}
            />
          </div>

          <div className='flex items-center gap-5'>
            <Input
              name='email'
              type='text'
              label='Прізвище'
              // value={}
              placeholder='example@gmail.com'
              // onChange={handleInput}
            />
            <Input
              name='email'
              type='text'
              label="Ім'я"
              // value={}
              placeholder='example@gmail.com'
              // onChange={handleInput}
            />
            <Input
              name='email'
              type='text'
              label='По батькові'
              // value={}
              placeholder='example@gmail.com'
              // onChange={handleInput}
            />
          </div>
        </div>
      )}
    </button>
  );
};

export default DeliveryBlock;
