'use client';

import {
  ClipboardDocumentListIcon,
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import ProfileNavbar from '@src/components/ProfileNavbar';
import { auth } from '@src/firebaseConfig';
import { useRouter } from '@src/navigation';
import { useAppSelector } from '@src/redux/hooks';
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
    <div className='flex items-start gap-10'>
      <ProfileNavbar
        displayName={auth.currentUser?.displayName}
        email={auth.currentUser?.email}
        onMenuItem={(item: IMenuItem) => handleClickMenuItem(item)}
      />
      <div className='inline-block min-h-full w-[2px] self-stretch bg-neutral-200 rounded-full opacity-100 dark:opacity-50'></div>
      <div className='p-5 flex-1'>{children}</div>
    </div>
  );
};

export default ProfileLayout;
