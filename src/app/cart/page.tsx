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
import { toast } from 'react-toastify';
import Modal from '@src/ui/Modal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MustAuthModal from '@src/components/Modals/MustAuthModal';
import { handleAddToWishList } from '@src/api/products';
import { IProductItem } from '@src/redux/models';

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
  const { userHistory } = useAppSelector((state) => state.products);
  const user = useAppSelector((state) => state.auth.user);
  const [mustAuthModal, setMustAuthModal] = React.useState(false);

  const redirectToPreviousPage = () => {
    router.back();
  };

  const clearCart = () => {
    if (window.confirm('Ви впевнені, що хочете очистити кошик?')) {
      dispatch(productsActions.clearCart());
      toast.info('Кошик очищено');
    }
  };

  const handleToOrdering = () => {
    if (user) {
      router.push(routes.ordering);
    } else {
      setMustAuthModal(true);
    }
  };

  const handleAddProductToWishlist = (product: IProductItem) => {
    if (user) {
      handleAddToWishList(product, userHistory, user, dispatch);
    } else {
      setMustAuthModal(true);
    }
  };

  return (
    <div className='py-2 w-full max-w-[1536px] mx-auto'>
      {cartTotalCount === 0 ? (
        <div className='p-5 flex flex-col gap-5'>
          <button
            onClick={redirectToPreviousPage}
            className='flex items-center gap-2 hover:text-colorMain'>
            <ArrowLeftIcon className='w-4 h-4 sm:w-6 sm:h-6' />
            <h2 className='sm:text-xl font-semibold'>Назад</h2>
          </button>
          <PagePlaceholder
            title='Ваша корзина пуста'
            description='Додайте товар та поверніться на сторінку корзини'
          />
        </div>
      ) : (
        <div className='flex flex-col gap-5 p-2 md:p-5'>
          <div className='flex items-center gap-4'>
            <button
              onClick={redirectToPreviousPage}
              className='flex items-center gap-2 hover:text-colorMain'>
              <ArrowLeftIcon className='w-4 h-4 sm:w-6 sm:h-6' />
              <h2 className='sm:text-xl font-semibold'>Назад</h2>
            </button>
            {!!cartTotalCount ? <div className='text-gray-600'>{cartTotalCount} товарів</div> : ''}
          </div>

          <div className='flex flex-col xl:flex-row items-start gap-3'>
            <div className='w-full flex-1 flex flex-col gap-3'>
              <div className='rounded-md xs:bg-white xs:border xs:border-gray-300 xs:p-2 md:p-5'>
                <Button className='w-full xs:w-auto' onClick={clearCart} danger primary>
                  <div className='flex justify-start items-center gap-3'>
                    <TrashIcon className='w-5 h-5' />
                    <div>Очистити кошик</div>
                  </div>
                </Button>
              </div>
              <div className='flex flex-col gap-3 justify-center items-center'>
                {cartProducts.map((item) => (
                  <ProductCartItem
                    addToWishlist={() => handleAddProductToWishlist(item)}
                    key={item.product.version}
                    item={item}
                  />
                ))}
              </div>
            </div>

            <div className='w-full xl:w-1/3 rounded-md flex flex-col gap-3 xl:gap-10 bg-white border border-gray-300 p-2 md:p-5'>
              <div className='flex flex-col gap-1 xl:gap-3'>
                <div className='text-lg gap-3 mdtext-2xl flex items-center justify-between'>
                  <div>Кількість товарів:</div>
                  <div className='font-semibold'>{productsCountToOrdering} шт.</div>
                </div>
                <div className='flex gap-3 items-center justify-between'>
                  <div className='text-xl md:text-3xl'>Загальна сума:</div>
                  <div className='font-semibold text-xl md:text-3xl'>
                    {productsPriceToOrdering}₴
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                {productToOrdering.length === 0 && (
                  <div className='font-semibold text-xs sm:text-sm text-center text-gray-600'>
                    Щоб продовжити виберіть принаймні один товар
                  </div>
                )}
                <Button
                  gray={productToOrdering.length === 0}
                  disabled={productToOrdering.length === 0}
                  giant
                  primary
                  className='w-full text-center flex justify-center'
                  onClick={handleToOrdering}>
                  Оформлення
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <MustAuthModal isOpen={mustAuthModal} onClose={() => setMustAuthModal(false)} />
    </div>
  );
};

export default Cart;
