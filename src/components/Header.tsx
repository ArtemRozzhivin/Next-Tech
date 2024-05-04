'use client';

import React, { useEffect } from 'react';
import Button from '@src/ui/Button';
import {
  HeartIcon,
  ShoppingCartIcon,
  ArrowRightIcon,
  UserIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import Dropdown from '../ui/Dropdown';
import Flag from 'react-flagkit';
import techLogo from '@assets/techLogo.png';
import Image from 'next/image';
import { auth } from '@src/firebaseConfig';
import ProfileMenu from './Profile/Menu';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { authActions } from '@src/redux/reducers/auth';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import routes from '@src/routes';
import { productsActions } from '@src/redux/reducers/Products/products';

type HeaderProps = {};

const Header: React.FC<HeaderProps> = ({}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const cartTotalCount = useAppSelector((state) => state.products.cartTotalCount);

  const logoutHandler = async () => {
    await signOut(auth);
    dispatch(authActions.logout());
    dispatch(productsActions.clearUserHistory());
  };

  return (
    <header className='bg-darkmain'>
      <div className='w-full max-w-[1536px] mx-auto text-lightmain flex justify-between items-center py-3'>
        <button className='mx-1 md:hidden lg:mx-4'>
          {/* <Bars3Icon className='w-10 h-10' /> */}
          <Image src={techLogo} width={40} alt='logo' />
        </button>
        <Link href={routes.main} className='hidden md:flex mx-1 lg:mx-4'>
          <Image src={techLogo} width={40} alt='logo' />
          <div className='ml-3'>
            <h3 className='font-bold text-xl uppercase leading-6'>Next Tech</h3>
            <div className='text-xs lg:text-sm leading-4 text-grayApp'>
              Магазин найкращої техніки
            </div>
          </div>
        </Link>
        <ul className='mx-1 flex gap-2 sm:gap-5 w-auto items-center lg:mx-4'>
          <li>
            <Link className='flex items-center gap-1' href='/cart'>
              <Button noBorder className='sm:px-6 sm:py-3'>
                <div className='relative'>
                  <ShoppingCartIcon className='h-8 w-8 text-lightmain' />
                  {!!cartTotalCount && (
                    <div className='absolute -top-[7px] -right-1 bg-colorMain rounded-full text-white text-xs py-[1px] px-[5px]'>
                      {cartTotalCount}
                    </div>
                  )}
                </div>
              </Button>
            </Link>
          </li>
          <li>
            {!!user ? (
              <div>
                <ProfileMenu user={user} logoutHandler={logoutHandler} />
              </div>
            ) : (
              <div>
                <Link href='/signin'>
                  <Button noBorder giant>
                    <UserIcon className='h-8 w-8 text-lightmain' />
                  </Button>
                </Link>
              </div>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
