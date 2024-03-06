'use client';

import ProductCard from '@src/components/ProductCard';
import React, { useState } from 'react';
import PagePlaceholder from '../PagePlaceholder';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { IProductCartItem, IProductItem } from '@src/redux/models';
import Modal from '@src/ui/Modal';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import ProductCartItem from '../ProductCartItem';
import { IUserHistory, productsActions } from '@src/redux/reducers/Products/products';
import Button from '@src/ui/Button';
import Image from 'next/image';
import { HeartIcon, TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { arrayRemove, arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@src/firebaseConfig';
import { getUserHistory } from '@src/api/user';
import AddedProductModal from '../AddedProductModal';
import { getAuth, updateProfile } from 'firebase/auth';
import { handleAddToWishList } from '@src/api/products';
import cx from 'clsx';
import { toast } from 'react-toastify';
import routes from '@src/routes';
import Link from 'next/link';

interface ICardList {
  items?: IProductItem[];
  gridLayout?: string;
}

const ProductsList = ({ items, gridLayout = 'large' }: ICardList) => {
  const dispatch = useAppDispatch();
  const { userHistory, currentProductToCart } = useAppSelector((state) => state.products);
  const user = useAppSelector((state) => state.auth.user);

  const [isShowModal, setShowModal] = useState(false);
  const [mustAuthModal, setMustAuthModal] = React.useState(false);

  const handleAddProductToCart = (product: IProductCartItem) => {
    dispatch(productsActions.addToCart(product));
    dispatch(productsActions.addProductToOrdering(product));
    dispatch(productsActions.setCurrentProductToCart(product));
    setShowModal(true);
    toast.success('Товар додано до кошику');
  };

  const handleAddProductToWishlist = (product: IProductItem) => {
    if (user) {
      handleAddToWishList(product, userHistory, user, dispatch);
    } else {
      setMustAuthModal(true);
    }
  };

  return (
    <>
      <div className=''>
        <div
          className={cx('grid grid-flow-row gap-1', {
            'grid-cols-4': gridLayout === 'large',
            'grid-cols-5': gridLayout === 'small',
          })}>
          {!!items ? (
            items.map((item) => (
              <ProductCard
                key={item.product.model}
                item={item}
                addToWishList={(product: IProductItem) => handleAddProductToWishlist(product)}
                addProductToCart={handleAddProductToCart}
              />
            ))
          ) : (
            <PagePlaceholder
              icon={<FaceFrownIcon className='w-10 h-10 text-colorMain' />}
              title='No products found'
              description='No products found, please reload the page'
            />
          )}
        </div>
      </div>

      {currentProductToCart && (
        <AddedProductModal
          handleAddToWishList={(product: IProductItem) => {
            if (user) {
              handleAddToWishList(product, userHistory, user, dispatch);
            } else {
              toast.error('Будь ласка, увійдіть до свого облікового запису для продовження');
            }
          }}
          item={currentProductToCart}
          isOpen={isShowModal}
          setOpenModal={setShowModal}
        />
      )}
      <Modal
        onClose={() => setMustAuthModal(false)}
        title={'Обліковий запис'}
        type='warning'
        isOpened={mustAuthModal}>
        <div className='flex flex-col items-center gap-2'>
          <div className='text-lg'>Увійдіть до свого облікового запису для продовження</div>
          <Link href={routes.signin}>
            <Button giant primary>
              Уввійти
            </Button>
          </Link>
        </div>

        <p className='mt-10 text-center text-sm text-gray-500 dark:text-gray-200'>
          <span>Все ще не зареєстровані на сайті? </span>
          <Link
            href={routes.signup}
            className='font-semibold leading-6 text-colorMain hover:text-colorSecond'>
            Зареєструватись
          </Link>
        </p>
      </Modal>
    </>
  );
};

export default ProductsList;
