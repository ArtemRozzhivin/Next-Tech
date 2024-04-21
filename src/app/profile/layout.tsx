'use client';

import {
  ClipboardDocumentListIcon,
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import ProfileNavbar from '@src/components/Profile/Navbar';
import { auth } from '@src/firebaseConfig';
import { useAppSelector } from '@src/redux/hooks';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface IMenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
}

interface IProfileLayout {
  children: React.ReactNode;
}

const ProfileLayout = ({ children }: IProfileLayout) => {
  const router = useRouter();
  const userHistory = useAppSelector((state) => state.products);

  const handleClickMenuItem = (item: IMenuItem) => {
    router.push(item.path);
  };

  return (
    <div className='h-full flex items-stretch'>
      <div className='border-r border-gray-300'>
        <ProfileNavbar
          displayName={auth.currentUser?.displayName}
          email={auth.currentUser?.email}
          onMenuItem={(item: IMenuItem) => handleClickMenuItem(item)}
        />
      </div>
      <div className='p-5 flex-1'>{children}</div>
    </div>
  );
};

export default ProfileLayout;
