'use client';

import React, { useEffect } from 'react';
import Button from '@src/ui/Button';
import { HeartIcon, ShoppingCartIcon, ArrowRightIcon, UserIcon } from '@heroicons/react/24/outline';
import Dropdown from '../../ui/Dropdown';
import Flag from 'react-flagkit';
import techLogo from '@assets/techLogo.png';
import Image from 'next/image';
import { auth } from '@src/firebaseConfig';
import ProfileMenu from '../ProfileMenu';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { authActions } from '@src/redux/reducers/auth';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

type HeaderProps = {};

const Header: React.FC<HeaderProps> = ({}) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const cartTotalCount = useAppSelector((state) => state.products.cartTotalCount);

  const logoutHandler = async () => {
    await signOut(auth);
    dispatch(authActions.logout());
  };

  return (
    <div className='bg-darkmain text-lightmain flex justify-between items-center py-3'>
      <div className='mx-1 md:hidden lg:mx-4'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-6 h-6'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
          />
        </svg>
      </div>
      <Link href='/' className='mx-1 flex lg:mx-4'>
        <Image src={techLogo} width={40} alt='logo' />
        <div className='hidden ml-3 md:block'>
          <h3 className='font-bold text-xl uppercase leading-6'>Next Tech</h3>
          <div className='text-xs lg:text-sm leading-4 text-grayApp'>Магазин найкращої техніки</div>
        </div>
      </Link>
      <ul className='mx-1 flex gap-5 w-auto items-center lg:mx-4'>
        <li>
          <Link className='flex items-center gap-1' href='/cart'>
            <Button noBorder giant>
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
  );
};

export default Header;
