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
import HeartSolidIcon from '@src/assets/heart.svg';

interface IProductCard {
  item: IProductItem;
  addToWishList: (product: IProductItem) => void;
  addProductToCart: (product: IProductCartItem) => void;
}

const ProductCard = ({ addProductToCart, addToWishList, item }: IProductCard) => {
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
    <div className='group border-gray-100/30 flex w-full flex-col self-center overflow-hidden rounded-lg border bg-darkmain shadow-2xl'>
      <div className='relative p-2 bg-white'>
        <div className='relative m-3 flex h-60 rounded-md'>
          <Image
            className='peer absolute top-0 right-0 h-full w-full object-contain'
            fill
            src={image.large ? image.large : image.front}
            alt='product'
          />
          {image.back && (
            <Image
              className='peer peer-hover:right-0 absolute top-0 -right-96 h-full w-full object-contain transition-all delay-100 duration-500 hover:right-0'
              fill
              src={image.back}
              alt='product'
            />
          )}
        </div>

        <div className='absolute right-3 top-3'>
          <button
            className='px-[4px] py-[3px] border border-colorMain rounded-full bg-white hover:bg-colorThird transition-all duration-300'
            onClick={() => addToWishList(item)}>
            {!inWishlist ? (
              <HeartIcon className='text-colorMain w-7 h-7' />
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-7 h-7 text-colorMain'>
                <path d='m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z' />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className='mt-4 px-5 pb-5'>
        <a href='#'>
          <h5 className='text-xl tracking-tight text-lightmain'>{product.model}</h5>
        </a>
        <div className='mt-2 mb-5 flex items-center justify-between'>
          <p>
            <span className='text-xl font-semibold text-lightmain'>{product.price} ₴</span>
          </p>
        </div>
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
  );
};

export default ProductCard;
