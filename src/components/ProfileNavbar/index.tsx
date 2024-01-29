'use client';

import {
  ClipboardDocumentListIcon,
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { Link } from '@src/navigation';
import routes from '@src/routes';
import cx from 'clsx';
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

interface IProfileNavbar {
  displayName?: string;
  email?: string;
  onMenuItem: (item: IMenuItem) => void;
}

const ProfileNavbar = ({ displayName, email, onMenuItem }: IProfileNavbar) => {
  const [menuItem, setMenuItem] = useState<IMenuItem>();

  const handleClickMenuItem = (item: IMenuItem) => {
    onMenuItem(item);
    setMenuItem(item);
  };

  return (
    <div className='p-5 flex flex-col gap-10'>
      {displayName && email && (
        <Link href={routes.profile} className='group flex items-center gap-2'>
          <div>
            <UserIcon className='w-11 h-11 text-colorMain' />
          </div>
          <div className='flex flex-col justify-center'>
            <div className='text-2xl group-hover:text-colorMain'>{displayName}</div>
            <div className='text-gray-600'>{email}</div>
          </div>
        </Link>
      )}
      <ul className='flex flex-col justify-center gap-3'>
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
