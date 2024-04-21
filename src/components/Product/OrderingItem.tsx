import { IProductCartItem, IProductItem } from '@src/redux/models';
import React from 'react';
import Image from 'next/image';
import { useAppDispatch } from '@src/redux/hooks';
import { productsActions } from '@src/redux/reducers/Products/products';

const ProductOrderingItem = ({ product, image, count }: IProductCartItem) => {
  const dispatch = useAppDispatch();

  const handlePlusProduct = () => {
    dispatch(productsActions.plusProductCart(product.id));
  };

  const handleMinusProduct = () => {
    dispatch(productsActions.minusProductCart(product.id));
  };

  const removeFromCart = async () => {
    if (window.confirm('Ви впевнені, що хочете видалити цей товар з кошика?')) {
      dispatch(productsActions.removeFromCart(product.id));
    }
  };

  return (
    <div className='rounded-md w-full bg-white'>
      <div className='flex items-center gap-5'>
        <div className='bg-white p-3 rounded-md'>
          <Image
            className='h-full w-full object-contain group-hover:scale-110 transition-all'
            width={100}
            height={100}
            src={image.large ? image.large : image.front}
            alt='product'
          />
        </div>
        <div className='w-full flex-grow flex flex-col items-center justify-center gap-2'>
          <div className='w-full flex items-center justify-between'>
            <div className='text-start'>
              <div>{product.model}</div>
              <div>
                {product.version}, {product.category}
              </div>
            </div>
            <div className=''>Кількість: {count}</div>
            <div className='text-2xl font-semibold'>{product.price} ₴</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOrderingItem;
