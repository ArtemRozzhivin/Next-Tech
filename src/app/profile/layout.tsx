'use client';

import ProfileNavbar, { ProfileMobileNavBar } from '@src/components/Profile/Navbar';
import { auth } from '@src/firebaseConfig';
import { useRouter } from 'next/navigation';
import React from 'react';

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

  const handleClickMenuItem = (item: IMenuItem) => {
    router.push(item.path);
  };

  return (
    <div className='w-full max-w-[1536px] mx-auto h-full sm:flex items-stretch'>
      <div className='hidden md:block border-r border-gray-300'>
        <ProfileNavbar
          displayName={auth.currentUser?.displayName}
          email={auth.currentUser?.email}
          onMenuItem={(item: IMenuItem) => handleClickMenuItem(item)}
        />
      </div>

      <div className='p-1 md:p-5 flex-1'>{children}</div>
      <div className='block md:hidden w-full fixed left-0 bottom-0 bg-white z-50'>
        <ProfileMobileNavBar
          displayName={auth.currentUser?.displayName}
          email={auth.currentUser?.email}
          onMenuItem={(item: IMenuItem) => handleClickMenuItem(item)}
        />
      </div>
    </div>
  );
};

export default ProfileLayout;
