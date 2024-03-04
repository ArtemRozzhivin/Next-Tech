'use client';

import React, { useEffect } from 'react';
import Button from '@src/ui/Button';
import { HeartIcon, ShoppingCartIcon, ArrowRightIcon, UserIcon } from '@heroicons/react/24/outline';
import Dropdown from '../../ui/Dropdown';
import Flag from 'react-flagkit';
import { useRouter, usePathname, Link } from '@src/navigation';
import { useLocale } from 'next-intl';
import techLogo from '@assets/techLogo.png';
import Image from 'next/image';
import { auth } from '@src/firebaseConfig';
import ProfileMenu from '../ProfileMenu';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { authActions } from '@src/redux/reducers/auth';
import products from '@src/data/products.json';

type Ilanguages = {
  lang: string;
  name: string;
  flag: string;
};

const languages: Ilanguages[] = [
  { lang: 'uk', name: 'Українська', flag: 'UA' },
  { lang: 'en', name: 'English', flag: 'GB' },
];

type HeaderProps = {};

const Header: React.FC<HeaderProps> = ({}) => {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const cartTotalCount = useAppSelector((state) => state.products.cartTotalCount);
  const [language, setLanguage] = React.useState<Ilanguages>(languages[0]);

  const logoutHandler = async () => {
    await signOut(auth);
    dispatch(authActions.logout());
  };

  useEffect(() => {
    const lang = languages.find((lng) => lng.lang === locale);
    setLanguage(lang as Ilanguages);
  }, [locale]);

  const changeLanguage = (lng: { lang: string; name: string; flag: string }) => {
    router.replace(pathname, { locale: lng.lang });
  };

  return (
    <div className='bg-darkmain text-lightmain flex justify-between items-center py-3'>
      <div onClick={() => {}} className='mx-1 md:hidden lg:mx-4'>
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
          <Dropdown
            chevron='mini'
            items={languages}
            buttonClassName='flex items-center w-full rounded-md border border-gray-300 shadow-sm px-3 md:px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 dark:text-gray-50 dark:border-gray-800 dark:bg-slate-800 dark:hover:bg-slate-700'
            selectItemClassName='text-gray-700 block px-4 py-2 text-base cursor-pointer hover:bg-gray-200 dark:text-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700'
            title={
              <>
                <Flag
                  className='rounded-sm mr-1.5'
                  country={language?.flag}
                  size={21}
                  alt=''
                  aria-hidden='true'
                />
                {language?.name}
              </>
            }
            keyExtractor={(lng: { lang: string; name: string; flag: string }) => lng.lang}
            labelExtractor={(lng: { name: string; flag: string }) => (
              <div className='flex'>
                <div className='pt-1'>
                  <Flag className='rounded-sm mr-1.5' country={lng.flag} size={21} alt={lng.flag} />
                </div>
                {lng.name}
              </div>
            )}
            onSelect={(lng) => changeLanguage(lng)}
          />
        </li>
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
