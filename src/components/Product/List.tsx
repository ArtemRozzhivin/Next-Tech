'use client';

import ProductCard from '@src/components/Product/Item';
import React, { useState } from 'react';
import PagePlaceholder from '../PagePlaceholder';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { IProductCartItem, IProductItem } from '@src/redux/models';
import Modal from '@src/ui/Modal';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import ProductCartItem from './CartItem';
import { IUserHistory, productsActions } from '@src/redux/reducers/Products/products';
import Button from '@src/ui/Button';
import Image from 'next/image';
import { HeartIcon, TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { arrayRemove, arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@src/firebaseConfig';
import { getUserHistory } from '@src/api/user';
import AddedProductModal from '../Modals/AddedProductModal';
import { getAuth, updateProfile } from 'firebase/auth';
import { handleAddToWishList } from '@src/api/products';
import cx from 'clsx';
import { toast } from 'react-toastify';
import routes from '@src/routes';
import Link from 'next/link';
import MustAuthModal from '../Modals/MustAuthModal';

interface IProductList {
  items?: IProductItem[];
  gridLayout?: string;
}

const ProductList = ({ items, gridLayout = 'large' }: IProductList) => {
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
      {!!items ? (
        <div
          className={cx('grid grid-flow-row gap-1', {
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4': gridLayout === 'large',
            'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5': gridLayout === 'small',
          })}>
          {items.map((item) => (
            <ProductCard
              key={item.product.id}
              item={item}
              addToWishList={(product: IProductItem) => handleAddProductToWishlist(product)}
              addProductToCart={handleAddProductToCart}
            />
          ))}
        </div>
      ) : (
        <PagePlaceholder
          icon={<FaceFrownIcon className='w-10 h-10 text-colorMain' />}
          title='Не знайдено жодного товару'
          description='Будь ласка, перезавантажте сторінку'
        />
      )}

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

      <MustAuthModal isOpen={mustAuthModal} onClose={() => setMustAuthModal(false)} />
    </>
  );
};

export default ProductList;
