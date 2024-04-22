'use client';

import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import cx from 'clsx';
import Image from 'next/image';
import routes from '@src/routes';
import { User } from 'firebase/auth';
import Link from 'next/link';

const ProfileMenu = ({ user, logoutHandler }: { user: User; logoutHandler: () => void }) => {
  return (
    <Menu as='div' className='relative ml-3'>
      <div>
        <Menu.Button className='flex justify-center items-center gap-2 font-semibold leading-6 text-base text-lightmain hover:brightness-110 transition-all dark:text-slate-200 dark:hover:text-white'>
          {user.photoURL && (
            <Image
              className='rounded-full'
              width={40}
              height={40}
              src={user.photoURL}
              alt='avatar'
            />
          )}
          <span className='hidden sm:inline-block'>{user.displayName}</span>
          <ChevronDownIcon className='h-4 w-4 ml-1 stroke-2' aria-hidden='true' />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'>
        <Menu.Items className='absolute right-0 z-30 mt-2 w-60 min-w-max origin-top-right rounded-md bg-white dark:bg-slate-900 py-1 shadow-lg ring-1 ring-slate-200 dark:ring-slate-800 focus:outline-none'>
          <div className='border-gray-200 dark:border-slate-700/50 border-b-[1px]'>
            <Menu.Item>
              <p className='truncate py-2 px-4' role='none'>
                <span className='block text-xs text-gray-500 dark:text-gray-300' role='none'>
                  Ви ввійшли як
                </span>
                <span
                  className='mt-0.5 text-sm font-semibold text-gray-700 dark:text-gray-50'
                  role='none'>
                  {user?.email}
                </span>
              </p>
            </Menu.Item>
          </div>

          <div className='border-gray-200 dark:border-slate-700/50 border-b-[1px]'>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={routes.wishlist}
                  className={cx('block px-4 py-2 text-sm text-gray-700 dark:text-gray-50', {
                    'bg-gray-100 dark:bg-slate-800': active,
                  })}>
                  Список бажань
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={routes.purchases}
                  className={cx('block px-4 py-2 text-sm text-gray-700 dark:text-gray-50', {
                    'bg-gray-100 dark:bg-slate-800': active,
                  })}>
                  Мої замовлення
                </Link>
              )}
            </Menu.Item>
          </div>

          <Menu.Item>
            {({ active }) => (
              <Link
                href={routes.profile}
                className={cx('block px-4 py-2 text-sm text-gray-700 dark:text-gray-50', {
                  'bg-gray-100 dark:bg-slate-800': active,
                })}>
                Особистий кабінет
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <p
                className={cx('cursor-pointer px-4 py-2 text-sm text-red-700 dark:text-gray-50', {
                  'bg-gray-100 dark:bg-slate-800': active,
                })}
                onClick={logoutHandler}>
                Вийти
              </p>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ProfileMenu;
