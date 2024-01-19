'use client';

import ProductCard from '@src/components/ProductCard';
import React, { useEffect, useState } from 'react';
import PagePlaceholder from '../PagePlaceholder';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { IProductCartItem, IProductItem } from '@src/redux/models';
import Modal from '@src/ui/Modal';
import { useTranslations } from 'next-intl';
import { useAppDispatch } from '@src/redux/hooks';
import ProductCartItem from '../ProductCartItem';
import { productsActions } from '@src/redux/reducers/products';
import Button from '@src/ui/Button';

interface ICardList {
  items?: IProductItem[];
}

const ProductsList = ({ items }: ICardList) => {
  const t = useTranslations('');
  const dispatch = useAppDispatch();
  const [showModeInfoModal, setShowModeInfoModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<IProductCartItem>({} as IProductCartItem);

  const handleAddProductToCart = (product: IProductCartItem) => {
    dispatch(productsActions.addToCart(product));
    setCurrentProduct(product);
    setShowModeInfoModal(true);
  };

  return (
    <>
      <div className='p-10'>
        <div className='grid grid-cols-4  grid-rows-3 gap-3'>
          {!!items ? (
            items.map((item) => (
              <ProductCard
                key={item.product.model}
                item={item}
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
      <Modal
        onClose={() => setShowModeInfoModal(false)}
        onSubmit={() => setShowModeInfoModal(false)}
        submitType='regular'
        title={'Товар додано до кошику'}
        message={<ProductCartItem {...currentProduct} />}
        type='info'
        submitText={'Перейти до кошику'}
        customButtons={
          <Button secondary onClick={() => setShowModeInfoModal(false)}>
            Оформити замовлення
          </Button>
        }
        isOpened={showModeInfoModal}
      />
    </>
  );
};

export default ProductsList;
