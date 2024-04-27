import { IProductCartItem, IProductItem } from '@src/redux/models';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '@src/ui/Button';
import { HeartIcon, TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import { productsActions } from '@src/redux/reducers/Products/products';
import Checkbox from '@src/ui/Checkbox';
import { selectProductToOrdering } from '@src/redux/reducers/Products/selectors';
import { toast } from 'react-toastify';

interface IProductCartItemProps {
  addToWishlist: () => void;
  item: IProductCartItem;
}

const ProductCartItem = ({ addToWishlist, item }: IProductCartItemProps) => {
  const dispatch = useAppDispatch();
  const isChecked = useAppSelector(selectProductToOrdering(item.product.id));
  const userHistory = useAppSelector((state) => state.products.userHistory);
  const [inWishlist, setInWishlist] = useState<boolean>(false);

  const handlePlusProduct = () => {
    dispatch(productsActions.plusProductCart(item.product.id));
  };

  const handleMinusProduct = () => {
    dispatch(productsActions.minusProductCart(item.product.id));
  };

  const removeFromCart = async () => {
    if (window.confirm('Ви впевнені, що хочете видалити цей товар з кошика?')) {
      dispatch(productsActions.removeFromCart(item.product.id));
      dispatch(productsActions.removeFromProductToOrdering(item.product.id));
      toast.info('Товар видалено з кошика');
    }
  };

  const removeFromProductsToOrdering = async () => {
    if (isChecked) {
      dispatch(productsActions.removeFromProductToOrdering(item.product.id));
    } else {
      dispatch(productsActions.addProductToOrdering(item));
    }
  };

  useEffect(() => {
    if (userHistory?.wishlist) {
      const inWIshList = userHistory?.wishlist.some(
        (product) => product.product.id === item.product.id,
      );
      setInWishlist(inWIshList);
    }
  }, [userHistory, item]);

  return (
    <div className='rounded-md w-full bg-white border border-gray-300 p-2 md:p-5'>
      <div className='flex items-center gap-3'>
        <Checkbox large onChange={removeFromProductsToOrdering} checked={isChecked} />
        <div className='bg-white p-1 sm:p-3'>
          <Image
            className='h-full w-full object-contain'
            width={100}
            height={100}
            src={item.image.large ? item.image.large : item.image.front}
            alt='product'
          />
        </div>
        <div className='w-full flex-grow flex flex-col items-center justify-center gap-2'>
          <div className='w-full flex gap-3 items-center justify-between'>
            <div className='text-xs xs:text-sm lg:text-base'>
              <div>{item.product.model}</div>
              <div>
                {item.product.version}, {item.product.category}
              </div>
            </div>
            <div className='hidden sm:block text-lg lg:text-2xl font-semibold'>
              {item.product.price * item.count}₴
            </div>
          </div>
          <div className='w-full hidden sm:flex gap-3 items-center justify-between'>
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
              <Button onClick={removeFromCart} semiDanger>
                <div className='flex items-center justify-center gap-1'>
                  <TrashIcon className='w-5 h-5' />
                  <div className='hidden lg:block'>Видалити</div>
                </div>
              </Button>
            </div>

            <div className='flex items-center gap-2'>
              <Button onClick={handleMinusProduct} secondary>
                <MinusIcon className='w-5 h-5' />
              </Button>
              <div>{item.count}</div>
              <Button onClick={handlePlusProduct} secondary>
                <PlusIcon className='w-5 h-5' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='sm:hidden pt-3 w-full flex gap-3 items-center justify-between'>
        <div className='flex items-center justify-center gap-2'>
          <Button className='w-7 h-7' secondary>
            <div className='flex items-center justify-center gap-1'>
              <HeartIcon className='w-5 h-5' />
            </div>
          </Button>
          <Button className='w-7 h-7' onClick={removeFromCart} semiDanger>
            <div className='flex items-center justify-center gap-1'>
              <TrashIcon className='w-5 h-5' />
            </div>
          </Button>
        </div>

        <div className='flex items-center gap-2'>
          <Button className='w-7 h-7' onClick={handleMinusProduct} secondary>
            <MinusIcon className='w-5 h-5' />
          </Button>
          <div className='text-sm'>{item.count}</div>
          <Button className='w-7 h-7' onClick={handlePlusProduct} secondary>
            <PlusIcon className='w-5 h-5' />
          </Button>
        </div>

        <div className='text-lg lg:text-2xl font-semibold'>{item.product.price * item.count}₴</div>
      </div>
    </div>
  );
};

export default ProductCartItem;
