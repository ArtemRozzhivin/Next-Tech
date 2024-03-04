'use client';

import ProductCard from '@src/components/ProductCard';
import React, { useState } from 'react';
import PagePlaceholder from '../PagePlaceholder';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { IProductCartItem, IProductItem } from '@src/redux/models';
import Modal from '@src/ui/Modal';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import ProductCartItem from '../ProductCartItem';
import { IUserHistory, productsActions } from '@src/redux/reducers/Products/products';
import Button from '@src/ui/Button';
import Image from 'next/image';
import { HeartIcon, TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Link } from '@src/navigation';
import { arrayRemove, arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@src/firebaseConfig';
import { getUserHistory } from '@src/api/user';
import AddedProductModal from '../AddedProductModal';
import { getAuth, updateProfile } from 'firebase/auth';
import { handleAddToWishList } from '@src/api/products';
import cx from 'clsx';

interface ICardList {
  items?: IProductItem[];
  gridLayout?: string;
}

const ProductsList = ({ items, gridLayout = 'large' }: ICardList) => {
  const t = useTranslations('');
  const dispatch = useAppDispatch();
  const { userHistory, currentProductToCart } = useAppSelector((state) => state.products);
  const user = useAppSelector((state) => state.auth.user);

  const [isShowModal, setShowModal] = useState(false);

  const handleAddProductToCart = (product: IProductCartItem) => {
    dispatch(productsActions.addToCart(product));
    dispatch(productsActions.addProductToOrdering(product));
    dispatch(productsActions.setCurrentProductToCart(product));
    setShowModal(true);
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
                addToWishList={(product: IProductItem) =>
                  handleAddToWishList(product, userHistory, user, dispatch)
                }
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
          handleAddToWishList={(product: IProductItem) =>
            handleAddToWishList(product, userHistory, user, dispatch)
          }
          item={currentProductToCart}
          isOpen={isShowModal}
          setOpenModal={setShowModal}
        />
      )}
    </>
  );
};

export default ProductsList;
