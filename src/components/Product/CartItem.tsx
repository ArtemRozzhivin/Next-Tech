import { IProductCartItem, IProductItem } from '@src/redux/models';
import React from 'react';
import Image from 'next/image';
import Button from '@src/ui/Button';
import { HeartIcon, TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import { productsActions } from '@src/redux/reducers/Products/products';
import Checkbox from '@src/ui/Checkbox';
import { selectProductToOrdering } from '@src/redux/reducers/Products/selectors';
import { toast } from 'react-toastify';

const ProductCartItem = ({ product, image, count }: IProductCartItem) => {
  const dispatch = useAppDispatch();
  const isChecked = useAppSelector(selectProductToOrdering(product.id));

  const handlePlusProduct = () => {
    dispatch(productsActions.plusProductCart(product.id));
  };

  const handleMinusProduct = () => {
    dispatch(productsActions.minusProductCart(product.id));
  };

  const removeFromCart = async () => {
    if (window.confirm('Ви впевнені, що хочете видалити цей товар з кошика?')) {
      dispatch(productsActions.removeFromCart(product.id));
      dispatch(productsActions.removeFromProductToOrdering(product.id));
      toast.info('Товар видалено з кошика');
    }
  };

  const removeFromProductsToOrdering = async () => {
    if (isChecked) {
      dispatch(productsActions.removeFromProductToOrdering(product.id));
    } else {
      dispatch(productsActions.addProductToOrdering({ product, image, count }));
    }
  };

  return (
    <div className='rounded-md w-full bg-white border border-gray-300 p-2 md:p-5'>
      <div className='flex items-center gap-3'>
        <Checkbox large onChange={removeFromProductsToOrdering} checked={isChecked} />
        <div className='bg-white p-1 sm:p-3'>
          <Image
            className='h-full w-full object-contain'
            width={100}
            height={100}
            src={image.large ? image.large : image.front}
            alt='product'
          />
        </div>
        <div className='w-full flex-grow flex flex-col items-center justify-center gap-2'>
          <div className='w-full flex gap-3 items-center justify-between'>
            <div className='text-xs xs:text-sm lg:text-base'>
              <div>{product.model}</div>
              <div>
                {product.version}, {product.category}
              </div>
            </div>
            <div className='hidden sm:block text-lg lg:text-2xl font-semibold'>
              {product.price * count}₴
            </div>
          </div>
          <div className='w-full hidden sm:flex gap-3 items-center justify-between'>
            <div className='flex items-center justify-center gap-4'>
              <Button secondary>
                <div className='flex items-center justify-center gap-1'>
                  <HeartIcon className='w-5 h-5' />
                  <div className='hidden md:block'>В обране</div>
                </div>
              </Button>
              <Button onClick={removeFromCart} semiDanger>
                <div className='flex items-center justify-center gap-1'>
                  <TrashIcon className='w-5 h-5' />
                  <div className='hidden md:block'>Видалити</div>
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

      <div className='sm:hidden pt-3 w-full flex gap-3 items-center justify-between'>
        <div className='flex items-center justify-center gap-2'>
          <Button className='w-7 h-7' secondary>
            <div className='flex items-center justify-center gap-1'>
              <HeartIcon className='w-5 h-5' />
            </div>
          </Button>
          <Button className='w-7 h-7' onClick={removeFromCart} semiDanger>
            <div className='flex items-center justify-center gap-1'>
              <TrashIcon className='w-5 h-5' />
            </div>
          </Button>
        </div>

        <div className='flex items-center gap-2'>
          <Button className='w-7 h-7' onClick={handleMinusProduct} secondary>
            <MinusIcon className='w-5 h-5' />
          </Button>
          <div className='text-sm'>{count}</div>
          <Button className='w-7 h-7' onClick={handlePlusProduct} secondary>
            <PlusIcon className='w-5 h-5' />
          </Button>
        </div>

        <div className='text-lg lg:text-2xl font-semibold'>{product.price * count}₴</div>
      </div>
    </div>
  );
};

export default ProductCartItem;
