'use client';

import React from 'react';
import { ArrowLeftIcon, ArrowLongLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import ProductCartItem from '@src/components/ProductCartItem';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import { Link, useRouter } from '@src/navigation';
import Button from '@src/ui/Button';
import { IUserHistory, productsActions } from '@src/redux/reducers/Products/products';
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@src/firebaseConfig';
import { getUserHistory } from '@src/api/user';
import routes from '@src/routes';
import ProductOrderingItem from '@src/components/ProductOrderingItem';
import Input from '@src/ui/Input';
import Image from 'next/image';
import novaPoshta from '@src/assets/novaPoshta.png';
import comfy from '@src/assets/comfy.svg';

export const Ordering = () => {
  const { cartProducts, cartProductsCount, cartProductsTotalPrice } = useAppSelector(
    (state) => state.products,
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const redirectToPreviousPage = () => {
    router.back();
  };

  const clearCart = () => {
    if (window.confirm('Ви впевнені, що хочете очистити кошик?')) {
      dispatch(productsActions.clearCart());
    }
  };

  const buyProducts = async () => {
    if (user) {
      try {
        const productRef = doc(db, 'users', user.uid);

        await updateDoc(productRef, {
          purchases: arrayUnion(...cartProducts),
        });
      } catch (error) {
        console.log(error);
      }
    }
    dispatch(productsActions.clearCart());

    getUserHistory(user).then((userHistory) => {
      if (userHistory) dispatch(productsActions.setUserHistory(userHistory as IUserHistory));
    });
  };

  return (
    <div className='flex flex-col gap-5 p-5'>
      <div className='flex items-start gap-3'>
        <div className='flex-1 flex flex-col gap-5'>
          <div className='flex flex-col gap-5'>
            <div className='text-2xl font-semibold'>1. Товари</div>
            <div className='flex flex-col gap-3 justify-center items-center'>
              {cartProducts.map((item) => (
                <ProductOrderingItem key={item.product.version} {...item} />
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-5'>
            <div className='text-2xl font-semibold'>2. Контактна інформація</div>
            <div className='rounded-md p-5 bg-lightmain'>
              <div className='flex items-center gap-20'>
                <Input
                  name='phone'
                  type='tel'
                  label='Номер телефону'
                  // value={}
                  placeholder='example@gmail.com'
                  // onChange={handleInput}
                />

                <Input
                  name='email'
                  type='text'
                  label='Електронна пошта'
                  // value={}
                  placeholder='example@gmail.com'
                  // onChange={handleInput}
                />
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-5'>
            <div className='text-2xl font-semibold'>3. Спосіб доставки</div>
            <div className='rounded-md p-5 bg-lightmain'>
              <div className='flex flex-col gap-10'>
                <div className='p-5 rounded-md border border-colorMain flex flex-col gap-5'>
                  <div className='flex items-center gap-3'>
                    <div className='w-5 h-5 rounded-full border border-colorMain'></div>
                    <div className='flex items-center gap-3'>
                      <div>Кур'єр Нова пошта </div>
                      <div>
                        <Image
                          width={30}
                          height={30}
                          src={novaPoshta}
                          alt='delivery-icon'
                          className='ogg-inline-tab__media-img'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col gap-5'>
                    <div className='flex items-center gap-5'>
                      <Input
                        name='email'
                        type='text'
                        label='Адреса доставки'
                        // value={}
                        placeholder='example@gmail.com'
                        // onChange={handleInput}
                      />
                      <Input
                        name='email'
                        type='text'
                        label='Будинок'
                        // value={}
                        placeholder='example@gmail.com'
                        // onChange={handleInput}
                      />
                      <Input
                        name='email'
                        type='text'
                        label='Квартира'
                        // value={}
                        placeholder='example@gmail.com'
                        // onChange={handleInput}
                      />
                    </div>

                    <div className='flex items-center gap-5'>
                      <Input
                        name='email'
                        type='text'
                        label='Прізвище'
                        // value={}
                        placeholder='example@gmail.com'
                        // onChange={handleInput}
                      />
                      <Input
                        name='email'
                        type='text'
                        label="Ім'я"
                        // value={}
                        placeholder='example@gmail.com'
                        // onChange={handleInput}
                      />
                      <Input
                        name='email'
                        type='text'
                        label='По батькові'
                        // value={}
                        placeholder='example@gmail.com'
                        // onChange={handleInput}
                      />
                    </div>
                  </div>
                </div>

                <div className='p-5 rounded-md border border-colorMain flex flex-col gap-5'>
                  <div className='flex items-center gap-3'>
                    <div className='w-5 h-5 rounded-full border border-colorMain'></div>
                    <div className='flex items-center gap-3'>
                      <div>Кур'єр COMFY </div>
                      <div>
                        <Image
                          width={65}
                          height={65}
                          src={comfy}
                          alt='delivery-icon'
                          className='ogg-inline-tab__media-img'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col gap-5'>
                    <div className='flex items-center gap-5'>
                      <Input
                        name='email'
                        type='text'
                        label='Адреса доставки'
                        // value={}
                        placeholder='example@gmail.com'
                        // onChange={handleInput}
                      />
                      <Input
                        name='email'
                        type='text'
                        label='Будинок'
                        // value={}
                        placeholder='example@gmail.com'
                        // onChange={handleInput}
                      />
                      <Input
                        name='email'
                        type='text'
                        label='Квартира'
                        // value={}
                        placeholder='example@gmail.com'
                        // onChange={handleInput}
                      />
                    </div>

                    <div className='flex items-center gap-5'>
                      <Input
                        name='email'
                        type='text'
                        label='Прізвище'
                        // value={}
                        placeholder='example@gmail.com'
                        // onChange={handleInput}
                      />
                      <Input
                        name='email'
                        type='text'
                        label="Ім'я"
                        // value={}
                        placeholder='example@gmail.com'
                        // onChange={handleInput}
                      />
                      <Input
                        name='email'
                        type='text'
                        label='По батькові'
                        // value={}
                        placeholder='example@gmail.com'
                        // onChange={handleInput}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='rounded-md flex flex-col gap-10 bg-lightmain p-5'>
          <div className='flex flex-col gap-3'>
            <div className='text-2xl flex items-center gap-32 justify-between'>
              <div>{cartProductsCount} товарів:</div>
              <div className='font-semibold'>{cartProductsTotalPrice} ₴</div>
            </div>
            <div className='text-2xl flex items-center gap-32 justify-between'>
              <div>Знижка:</div>
              <div className='font-semibold'>3000 $</div>
            </div>
          </div>

          <div className='w-full h-0.5 bg-neutral-100 opacity-100 dark:opacity-50' />

          <div className='flex flex-col gap-10'>
            <div className='flex items-center gap-32 justify-between'>
              <div className='text-3xl'>До сплати: </div>
              <div className='font-semibold text-3xl'>{cartProductsTotalPrice} ₴</div>
            </div>
            <Link href={routes.ordering}>
              <Button
                // onClick={buyProducts}
                giant
                primary
                className='w-full text-center flex justify-center'>
                Оформлення
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ordering;
