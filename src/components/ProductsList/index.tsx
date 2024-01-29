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

interface ICardList {
  items?: IProductItem[];
}

const ProductsList = ({ items }: ICardList) => {
  const t = useTranslations('');
  const dispatch = useAppDispatch();
  const { userHistory, currentProductToCart } = useAppSelector((state) => state.products);
  const user = useAppSelector((state) => state.auth.user);

  const [isShowModal, setShowModal] = useState(false);

  const handleAddProductToCart = (product: IProductCartItem) => {
    dispatch(productsActions.addToCart(product));
    dispatch(productsActions.setCurrentProductToCart(product));
    setShowModal(true);
  };

  const handleAddToWishList = async (product: IProductItem) => {
    if (user) {
      try {
        const productRef = doc(db, 'users', user.uid);

        if (userHistory?.wishlist?.find((item) => item.product.id === product.product.id)) {
          console.log('remove');
          await updateDoc(productRef, {
            user: user.uid,
            wishlist: arrayRemove(product),
          });
        } else {
          console.log('add');
          await updateDoc(productRef, {
            user: user.uid,
            wishlist: arrayUnion(product),
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    getUserHistory(user).then((userHistory) => {
      if (userHistory) dispatch(productsActions.setUserHistory(userHistory as IUserHistory));
    });
  };

  return (
    <>
      <div className='p-10'>
        <div className='grid grid-flow-row grid-cols-4 gap-3'>
          {!!items ? (
            items.map((item) => (
              <ProductCard
                key={item.product.model}
                item={item}
                addToWishList={(product: IProductItem) => handleAddToWishList(product)}
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
          handleAddToWishList={(product: IProductItem) => handleAddToWishList(product)}
          item={currentProductToCart}
          isOpen={isShowModal}
          setOpenModal={setShowModal}
        />
      )}
    </>
  );
};

export default ProductsList;
