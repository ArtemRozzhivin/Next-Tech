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
import { productsActions } from '@src/redux/reducers/Products/products';
import Button from '@src/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon, TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

const AddedProductModal = ({
  item,
  isOpen,
  setOpenModal,
}: {
  item: IProductCartItem;
  isOpen: boolean;
  setOpenModal: (value: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const { product, image, count } = item;

  const handlePlusProduct = () => {
    dispatch(productsActions.plusProductCart(product.id));
  };

  const handleMinusProduct = () => {
    dispatch(productsActions.minusProductCart(product.id));
  };

  const removeFromCart = async () => {
    if (window.confirm('Ви впевнені, що хочете видалити цей товар з кошика?')) {
      dispatch(productsActions.removeFromCart(product.id));
      setOpenModal(false);
    }
  };

  return (
    <Modal
      onClose={() => setOpenModal(false)}
      title={'Товар додано до кошику'}
      type='info'
      isOpened={isOpen}>
      <div className='flex flex-col gap-8'>
        <div className='flex items-center gap-4'>
          <div className='bg-white p-3'>
            <Image
              className='h-full w-full object-contain'
              width={200}
              height={200}
              src={image.large ? image.large : image.front}
              alt='product'
            />
          </div>

          <div className='w-full flex-grow flex flex-col items-center justify-center gap-6'>
            <div className='w-full flex items-start justify-between'>
              <div>
                <div className='text-2xl'>{product.model}</div>
                <div className='text-lg text-gray-600'>
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

        <div className='flex items-center justify-between gap-10'>
          <Link className='h-full' href='/cart'>
            <Button giant noBorder onClick={() => setOpenModal(true)}>
              Продовжити покупки
            </Button>
          </Link>

          <div className='flex items-center gap-3'>
            <Link className='h-full' href='/cart'>
              <Button giant primary onClick={() => setOpenModal(true)}>
                Перейти до кошику
              </Button>
            </Link>
            <Link className='h-full' href='/cart'>
              <Button giant secondary onClick={() => setOpenModal(true)}>
                Оформити замовлення
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

interface ICardList {
  items?: IProductItem[];
}

const ProductsList = ({ items }: ICardList) => {
  const t = useTranslations('');
  const dispatch = useAppDispatch();
  const currentProductToCart = useAppSelector((state) => state.products.currentProductToCart);
  const [isShowModal, setShowModal] = useState(false);

  const handleAddProductToCart = (product: IProductCartItem) => {
    dispatch(productsActions.addToCart(product));
    dispatch(productsActions.setCurrentProductToCart(product));
    setShowModal(true);
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

      {!!currentProductToCart && (
        <AddedProductModal
          item={currentProductToCart}
          isOpen={isShowModal}
          setOpenModal={setShowModal}
        />
      )}
    </>
  );
};

export default ProductsList;
