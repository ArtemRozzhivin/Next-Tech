'use client';

import React from 'react';
import { ArrowLeftIcon, ArrowLongLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import ProductCartItem from '@src/components/ProductCartItem';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import { Link, useRouter } from '@src/navigation';
import Button from '@src/ui/Button';
import { IUserHistory, productsActions } from '@src/redux/reducers/Products/products';
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@src/firebaseConfig';
import { getUserHistory } from '@src/api/user';

export const Cart = () => {
  const { cartProducts, cartProductsCount, cartProductsTotalPrice } = useAppSelector(
    (state) => state.products,
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const redirectToPreviousPage = () => {
    router.back();
  };

  const clearCart = () => {
    if (window.confirm('Ви впевнені, що хочете очистити кошик?')) {
      dispatch(productsActions.clearCart());
    }
  };

  const buyProducts = async () => {
    if (user) {
      try {
        const productRef = doc(db, 'users', user.uid);

        await updateDoc(productRef, {
          purchases: arrayUnion(...cartProducts),
        });
      } catch (error) {
        console.log(error);
      }
    }
    dispatch(productsActions.clearCart());

    getUserHistory(user).then((userHistory) => {
      if (userHistory) dispatch(productsActions.setUserHistory(userHistory as IUserHistory));
    });
  };

  return (
    <div>
      <div className='flex items-center gap-4'>
        <button
          onClick={redirectToPreviousPage}
          className='flex items-center gap-2 hover:text-colorMain'>
          <ArrowLeftIcon className='w-6 h-6' />
          <h2 className='text-xl font-semibold'>Назад</h2>
        </button>
        {!!cartProductsCount ? (
          <div className='text-gray-600'>{cartProductsCount} товарів</div>
        ) : (
          ''
        )}
      </div>

      <div className='flex items-start'>
        <div className='border border-red-400'>
          <div className='bg-lightmain p-5'>
            <Button onClick={clearCart} danger primary>
              <div className='flex justify-start items-center gap-3'>
                <TrashIcon className='w-5 h-5' />
                <div>Очистити кошик</div>
              </div>
            </Button>
          </div>
          <div className='px-2 py-4 flex flex-col gap-3 justify-center items-center'>
            {cartProducts.map((item) => (
              <ProductCartItem key={item.product.version} {...item} />
            ))}
          </div>
        </div>

        <div className='bg-lightmain p-2'>
          <div className='flex items-center justify-between'>
            <div>{cartProductsCount} товарів</div>
            <div>{cartProductsTotalPrice} ₴</div>
          </div>
          {/* <div className='flex items-center justify-between'>
            <div>Знижка</div>
            <div>Якась знижка</div>
          </div> */}
          <div className='flex items-center justify-between'>
            <div>Загальна сума</div>
            <div>{cartProductsTotalPrice} ₴</div>
          </div>
          <Button onClick={buyProducts} giant primary className=''>
            Оформлення
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
