'use client';

import { HeartIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import { IProductCartItem, IProductItem } from '@src/redux/models';
import { productsActions } from '@src/redux/reducers/Products/products';
import routes from '@src/routes';
import Button from '@src/ui/Button';
import Modal from '@src/ui/Modal';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AddedProductModal = ({
  handleAddToWishList,
  item,
  isOpen,
  setOpenModal,
}: {
  handleAddToWishList: (product: IProductItem) => void;
  item: IProductCartItem;
  isOpen: boolean;
  setOpenModal: (value: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const userHistory = useAppSelector((state) => state.products.userHistory);
  const { product, image, count } = item;
  const [inWishlist, setInWishlist] = useState<boolean>(false);

  useEffect(() => {
    if (userHistory?.wishlist) {
      const inWIshList = userHistory?.wishlist.some(
        (product) => product.product.id === item.product.id,
      );
      setInWishlist(inWIshList);
    }
  }, [userHistory, item]);

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
      toast.info('Товар видалено з кошика');
    }
  };

  const addToWishlist = () => {
    handleAddToWishList(item);
  };

  return (
    <Modal
      onClose={() => setOpenModal(false)}
      title={'Товар додано до кошику'}
      type='info'
      isOpened={isOpen}>
      <div className='flex flex-col gap-8'>
        <div className='flex flex-col sm:flex-row items-center gap-4'>
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
                <div className='sm:text-2xl'>{product.model}</div>
                <div className='sm:text-lg text-gray-600'>
                  {product.version}, {product.category}
                </div>
              </div>
              <div className='sm:text-2xl font-semibold'>{product.price} ₴</div>
            </div>
            <div className='w-full flex flex-col sm:flex-row gap-5 sm:gap-0 items-center justify-between'>
              <div className='flex items-center justify-center gap-4'>
                {inWishlist ? (
                  <Button
                    className='bg-green-600 hover:bg-green-700 text-white'
                    onClick={addToWishlist}
                    primary>
                    <div className='flex items-center justify-center gap-1'>
                      <HeartIcon className='w-5 h-5' />
                      <div>В обраному</div>
                    </div>
                  </Button>
                ) : (
                  <Button onClick={addToWishlist} secondary>
                    <div className='flex items-center justify-center gap-1'>
                      <HeartIcon className='w-5 h-5' />
                      <div>В обране</div>
                    </div>
                  </Button>
                )}
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

        <div className='flex flex-col sm:flex-row items-center justify-between gap-10'>
          <Button
            className='text-sm px-2.5 py-1.5 sm:px-6 sm:py-3 sm:text-base'
            noBorder
            onClick={() => setOpenModal(false)}>
            Продовжити покупки
          </Button>

          <div className='flex items-center gap-3'>
            <Link className='h-full' href={routes.cart}>
              <Button
                className='text-sm px-2.5 py-1.5 sm:px-6 sm:py-3 sm:text-base'
                primary
                onClick={() => setOpenModal(false)}>
                Перейти до кошику
              </Button>
            </Link>
            <Link className='h-full' href={routes.ordering}>
              <Button
                className='text-sm px-2.5 py-1.5 sm:px-6 sm:py-3 sm:text-base'
                secondary
                onClick={() => setOpenModal(false)}>
                Оформити замовлення
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddedProductModal;
