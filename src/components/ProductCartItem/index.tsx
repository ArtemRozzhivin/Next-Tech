import { IProductCartItem, IProductItem } from '@src/redux/models';
import React from 'react';
import Image from 'next/image';
import Button from '@src/ui/Button';
import { HeartIcon, TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAppDispatch } from '@src/redux/hooks';
import { productsActions } from '@src/redux/reducers/Products/products';

const ProductCartItem = ({ product, image, count }: IProductCartItem) => {
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
              <Button onClick={removeFromCart} secondary>
                <div className='flex items-center justify-center gap-1'>
                  <TrashIcon className='w-5 h-5' />
                  <div>Видалити</div>
                </div>
              </Button>
            </div>

            <div className='flex items-center gap-2'>
              <Button onClick={handleMinusProduct} secondary>
                <MinusIcon className='w-5 h-5' />
              </Button>
              <div>{count}</div>
              <Button onClick={handlePlusProduct} secondary>
                <PlusIcon className='w-5 h-5' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCartItem;
