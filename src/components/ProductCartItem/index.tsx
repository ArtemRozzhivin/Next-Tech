import { IProductItem } from '@src/redux/models';
import React from 'react';
import Image from 'next/image';
import Button from '@src/ui/Button';
import { HeartIcon, TrashIcon } from '@heroicons/react/24/outline';

const ProductCartItem = ({ product, image }: IProductItem) => {
  return (
    <div className='w-full bg-lightmain p-2'>
      <div className='flex items-center gap-3'>
        <div>Checkbox</div>
        <div className='bg-white p-3'>
          <Image
            className='h-full w-full object-contain'
            width={100}
            height={100}
            src={image.large ? image.large : image.front}
            alt='product'
          />
        </div>
        <div className='w-full flex-grow flex flex-col items-center justify-center gap-2'>
          <div className='w-full flex items-center justify-between'>
            <div>
              <div>{product.model}</div>
              <div>
                {product.version}, {product.category}
              </div>
            </div>
            <div className='text-2xl font-semibold'>{product.price} ₴</div>
          </div>
          <div className='w-full flex items-center justify-between'>
            <div className='flex items-center justify-center gap-4'>
              <Button secondary>
                <div className='flex items-center justify-center gap-1'>
                  <HeartIcon className='w-5 h-5' />
                  <div>В обране</div>
                </div>
              </Button>
              <Button secondary>
                <div className='flex items-center justify-center gap-1'>
                  <TrashIcon className='w-5 h-5' />
                  <div>Видалити</div>
                </div>
              </Button>
            </div>
            <div>Price & count</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCartItem;
