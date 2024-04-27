'use client';

import {
  ClipboardDocumentListIcon,
  HeartIcon,
  HomeIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import routes from '@src/routes';
import cx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export interface IMenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
}

const navbarMenu: IMenuItem[] = [
  {
    title: 'Головна',
    icon: <HomeIcon className='w-7 h-7' />,
    path: routes.main,
  },
  {
    title: 'Кошик',
    icon: <ShoppingCartIcon className='w-7 h-7' />,
    path: routes.cart,
  },
  {
    title: 'Обране',
    icon: <HeartIcon className='w-7 h-7' />,
    path: routes.wishlist,
  },
];

const MobileNavBar = () => {
  const router = useRouter();

  const handleClickMenuItem = (item: IMenuItem) => {
    router.push(item.path);
  };

  return (
    <div className='border-t border-gray-300 h-full flex flex-col'>
      <ul className='flex justify-center gap-5 p-3'>
        {navbarMenu.map((item) => (
          <li className='hover:text-colorMain transition-all' key={item.title}>
            <button
              onClick={() => handleClickMenuItem(item)}
              className={'text-xl flex items-center gap-2'}>
              {item.icon}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobileNavBar;
