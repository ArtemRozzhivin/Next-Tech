import { IProductCartItem } from '@src/redux/models';
import React from 'react';
import Image from 'next/image';

const ProductOrderingItem = ({ product, image, count }: IProductCartItem) => {
  return (
    <div className='rounded-md w-full bg-white'>
      <div className='flex flex-col md:flex-row items-center gap-5'>
        <div className='bg-white p-3 rounded-md'>
          <Image
            className='h-full w-full object-contain group-hover:scale-110 transition-all'
            width={window.innerWidth > 400 ? 100 : 70}
            height={window.innerWidth > 400 ? 100 : 70}
            src={image.large ?? image.front}
            alt='product'
          />
        </div>
        <div className='w-full flex-grow flex flex-col items-center justify-center gap-2'>
          <div className='w-full flex flex-col gap-3 md:flex-row md:items-center justify-between'>
            <div className='text-xs xs:text-sm lg:text-base text-start'>
              <div>{product.model}</div>
              <div>
                {product.version}, {product.category}
              </div>
            </div>
            <div className='hidden md:block'>
              Кількість: {count}
              <div className='text-gray-600 text-xs text-left'>1x = {product.price}</div>
            </div>
            <div className='hidden md:block text-2xl font-semibold'>{product.price}₴</div>

            <div className='w-full flex items-center justify-between md:hidden'>
              <div>
                Кількість: {count}
                <div className='text-gray-600 text-xs text-left'>1x = {product.price}</div>
              </div>
              <div className='text-lg font-semibold'>{count * product.price}₴</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOrderingItem;
