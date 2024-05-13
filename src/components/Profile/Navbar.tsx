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
import React, { useState } from 'react';

interface IMenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
}

const navbarMenu: IMenuItem[] = [
  {
    title: 'Мої замовлення',
    icon: <ClipboardDocumentListIcon className='w-7 h-7' />,
    path: '/profile/purchases',
  },
  {
    title: 'Кошик',
    icon: <ShoppingCartIcon className='w-7 h-7' />,
    path: '/profile/cart',
  },
  {
    title: 'Список бажань',
    icon: <HeartIcon className='w-7 h-7' />,
    path: '/profile/wishlist',
  },
];

export const ProfileMobileNavBar = ({ onMenuItem }: IProfileNavbar) => {
  const handleClickMenuItem = (item: IMenuItem) => {
    onMenuItem(item);
  };

  return (
    <div className='border-t border-gray-300 h-full flex flex-col'>
      <ul className='flex justify-center gap-5 p-3'>
        <li className='hover:text-colorMain transition-all'>
          <Link href={routes.main} className='text-xl flex items-center gap-2'>
            <HomeIcon className='w-7 h-7' />
          </Link>
        </li>

        <li className='hover:text-colorMain transition-all'>
          <Link href={routes.profile} className='text-xl flex items-center gap-2'>
            <UserIcon className='w-7 h-7' />
          </Link>
        </li>

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

interface IProfileNavbar {
  displayName?: string | null;
  email?: string | null;
  onMenuItem: (item: IMenuItem) => void;
}

const ProfileNavbar = ({ displayName, email, onMenuItem }: IProfileNavbar) => {
  const [menuItem, setMenuItem] = useState<IMenuItem>();

  const handleClickMenuItem = (item: IMenuItem) => {
    onMenuItem(item);
    setMenuItem(item);
  };

  return (
    <div className='h-full flex flex-col'>
      <div className='border-b border-gray-300 p-[6px] lg:p-5'>
        {displayName && email && (
          <Link href={routes.profile} className='group flex items-center gap-2'>
            <div>
              <UserIcon className='w-11 h-11 text-gray-700 group-hover:text-colorMain' />
            </div>
            <div className='flex flex-col justify-center'>
              <div className='text-2xl group-hover:text-colorMain'>{displayName}</div>
              <div className='text-gray-600 group-hover:text-colorMain'>{email}</div>
            </div>
          </Link>
        )}
      </div>
      <ul className='flex flex-col justify-center gap-3 p-[6px] lg:p-5'>
        {navbarMenu.map((item) => (
          <li className='hover:text-colorMain transition-all' key={item.title}>
            <button
              onClick={() => handleClickMenuItem(item)}
              className={cx(
                'text-xl flex items-center gap-2',
                item.title === menuItem?.title && 'text-colorMain',
              )}>
              {item.icon}
              <div>{item.title}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileNavbar;
