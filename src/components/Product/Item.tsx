'use client';

import { db } from '@src/firebaseConfig';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';
import Button from '@src/ui/Button';
import Image from 'next/image';
import { IProductCartItem, IProductItem } from '@src/redux/models';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import { productsActions } from '@src/redux/reducers/Products/products';
import { selectCartItemById } from '@src/redux/reducers/Products/selectors';
import cx from 'clsx';
import Link from 'next/link';

interface IProductItem {
  item: IProductItem;
  addToWishList: (product: IProductItem) => void;
  addProductToCart: (product: IProductCartItem) => void;
}

const ProductItem = ({ addProductToCart, addToWishList, item }: IProductItem) => {
  const [inWishlist, setInWishlist] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const userHistory = useAppSelector((state) => state.products.userHistory);

  useEffect(() => {
    if (userHistory?.wishlist) {
      const inWIshList = userHistory?.wishlist.some(
        (product) => product.product.id === item.product.id,
      );
      setInWishlist(inWIshList);
    }
  }, [userHistory]);

  const { product, image } = item;
  const itemCart = useAppSelector(selectCartItemById(product.id));

  const addToCart = async () => {
    const item = {
      product,
      image,
      count: 1,
    } as IProductCartItem;

    addProductToCart(item);
  };

  return (
    <div className='h-full group border-gray-100/30 flex w-full flex-col self-center overflow-hidden rounded-lg border bg-lightmain shadow-sm hover:border-gray-300 hover:shadow-2xl transition-all'>
      <div className='relative p-2 bg-white'>
        <Link href={`/laptops/${item.product.id}`} className='relative m-3 flex h-60 rounded-md'>
          <Image
            className='group-hover:scale-110 h-full w-full object-contain transition-all'
            fill
            src={image.large && image.large}
            alt='product'
          />
        </Link>

        <div className='absolute right-3 top-3'>
          <button
            className={cx(
              'px-[4px] py-[3px] border border-gray-300 rounded-full hover:brightness-90 transition-all duration-300',
              inWishlist ? 'bg-colorMain border-white' : 'bg-white',
            )}
            onClick={() => addToWishList(item)}>
            {!inWishlist ? (
              <HeartIcon className='text-gray-400 w-7 h-7' />
            ) : (
              <HeartIcon className='text-white w-7 h-7' />
            )}
          </button>
        </div>
      </div>
      <div className='flex-1 flex flex-col mt-4 px-5 pb-5'>
        <div>
          <a href='#'>
            <h5 className='text-sm sm:text-xl tracking-tight text-darkmain'>{product.model}</h5>
          </a>
          <div className='mt-2 mb-5 flex items-center justify-between'>
            <p>
              <span className='text-sm sm:text-xl font-semibold text-darkmain'>
                {product.price} ₴
              </span>
            </p>
          </div>
        </div>
        <div className='flex-1 flex items-end'>
          {!!itemCart ? (
            <Button
              primary
              className='w-full bg-green-600 hover:bg-green-700 rounded-md border border-transparent px-5 py-2.5 text-sm font-medium text-white'>
              <div className='w-full text-center flex items-center justify-center gap-2'>
                <CheckIcon className='w-6 h-6' />
                In the cart
              </div>
            </Button>
          ) : (
            <Button
              primary
              onClick={addToCart}
              className='w-full rounded-md border border-transparent bg-colorMain px-5 py-2.5 text-sm font-medium text-white'>
              <div className='w-full text-center flex items-center justify-center gap-2'>
                <ShoppingCartIcon className='w-6 h-6' />
                Add to cart
              </div>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
