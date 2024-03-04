'use client';

import React, { useState } from 'react';
import {
  UserIcon,
  ShoppingCartIcon,
  HeartIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { useAppSelector } from '@src/redux/hooks';
import Wishlist from './wishlist/page';
import { auth } from '@src/firebaseConfig';
import Image from 'next/image';

const Profile = () => {
  console.log();

  return (
    <div className='flex flex-col gap-4'>
      <h3 className='text-2xl font-semibold'>Особиста інформація</h3>
      <div>
        <div>
          <Image
            className='rounded-full'
            width={80}
            height={80}
            src={auth.currentUser?.photoURL}
            alt='user-avatar'
          />
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-1 justify-center'>
            <div className='text-gray-600'>Відображуване ім'я</div>
            <div>{auth.currentUser?.displayName}</div>
          </div>
          <div className='flex flex-col gap-1 justify-center'>
            <div className='text-gray-600'>Електронна пошта</div>
            <div>{auth.currentUser?.email}</div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-1 justify-center'>
            <div className='text-gray-600'>Створено</div>
            <div>{auth.currentUser?.metadata.creationTime}</div>
          </div>
          <div className='flex flex-col gap-1 justify-center'>
            <div className='text-gray-600'>Остання авторизація</div>
            <div>{auth.currentUser?.metadata.lastSignInTime}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
