'use client';

import React, { useEffect } from 'react';
import { ArrowLeftIcon, ArrowLongLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import ProductCartItem from '@src/components/Product/CartItem';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import Button from '@src/ui/Button';
import { IUserHistory, productsActions } from '@src/redux/reducers/Products/products';
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@src/firebaseConfig';
import { getUserHistory } from '@src/api/user';
import routes from '@src/routes';
import PagePlaceholder from '@src/components/PagePlaceholder';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const Cart = () => {
  const {
    cartProducts,
    productsCountToOrdering,
    productsPriceToOrdering,
    productToOrdering,
    cartTotalCount,
  } = useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const clearCart = () => {
    if (window.confirm('Ви впевнені, що хочете очистити кошик?')) {
      dispatch(productsActions.clearCart());
    }
  };

  return (
    <div>
      <h2 className='text-3xl font-semibold'>Кошик</h2>
      {cartTotalCount === 0 ? (
        <div className='p-5 flex flex-col gap-5'>
          <PagePlaceholder
            title='Ваша корзина пуста'
            description='Додайте товар та поверніться на сторінку корзини'
          />
        </div>
      ) : (
        <div className='flex flex-col gap-5 p-5'>
          <div>
            {!!cartTotalCount ? <div className='text-gray-600'>{cartTotalCount} товарів</div> : ''}
          </div>

          <div className='flex flex-col items-start gap-3'>
            <div className='flex-1 flex flex-col gap-3'>
              <div className='rounded-md bg-white border border-gray-300 p-5'>
                <Button onClick={clearCart} danger primary>
                  <div className='flex justify-start items-center gap-3'>
                    <TrashIcon className='w-5 h-5' />
                    <div>Очистити кошик</div>
                  </div>
                </Button>
              </div>
              <div className='flex flex-col gap-3 justify-center items-center'>
                {cartProducts.map((item) => (
                  <ProductCartItem key={item.product.id} {...item} />
                ))}
              </div>
            </div>

            <div className='rounded-md flex flex-col gap-10 bg-white border border-gray-300 p-5'>
              <div className='flex flex-col gap-3'>
                <div className='text-2xl flex items-center gap-32 justify-between'>
                  <div>{productsCountToOrdering} товарів на суму</div>
                  <div className='font-semibold'>{productsPriceToOrdering} ₴</div>
                </div>
                <div className='flex items-center gap-32 justify-between'>
                  <div className='text-3xl'>Загальна сума</div>
                  <div className='font-semibold text-3xl'>{productsPriceToOrdering} ₴</div>
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                {productToOrdering.length === 0 && (
                  <div className='font-semibold text-sm text-center text-gray-600'>
                    Щоб продовжити виберіть принаймні один товар
                  </div>
                )}
                <Link href={routes.ordering}>
                  <Button
                    gray={productToOrdering.length === 0}
                    disabled={productToOrdering.length === 0}
                    giant
                    primary
                    className='w-full text-center flex justify-center'>
                    Оформлення
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
