"use client";

import React from 'react';
import Button from '@ui/Button';
import Link from 'next/link';
import { HeartIcon, ShoppingCartIcon, ArrowRightIcon, UserIcon } from '@heroicons/react/24/outline'


type HeaderProps = {
};

const Header: React.FC<HeaderProps> = ({ }) => {
  return (
    <div className="bg-lightmain text-darkmain flex justify-between items-center py-5">
      <div onClick={() => {}} className="mx-1 md:hidden lg:mx-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </div>
      <Link href="/" className="mx-1 flex lg:mx-4">
        <img src="assets/logo.png" alt="logo" />
        <div className="hidden ml-3 md:block">
          <h3 className="font-bold text-xl uppercase leading-6">Next Tech</h3>
          <div className="text-xs lg:text-sm leading-4 text-grayApp">
            Магазин найкращої техніки
          </div>
        </div>
      </Link>
      <ul className="mx-1 flex gap-5 w-auto items-center lg:mx-4">
        <li>
          <Button primary>
            <Link className='flex items-center gap-1' href="/signin">
              Кошик
              <ShoppingCartIcon className="h-5 w-5 text-darkmain" />
            </Link>
          </Button>
        </li>
        <li className="hidden md:block">
          <Link className='flex items-center gap-1' href="/">
          Улюблені
          <HeartIcon className="h-5 w-5 text-darkmain" />
          </Link>
        </li>
        <li>
          <Button primary>
            <Link href="/signin" className='flex items-center gap-1'>
              SignIn
              <ArrowRightIcon className="h-5 w-5 text-darkmain" />
            </Link>
          </Button>
        </li>
        <li>
          <Button primary>
            <Link className='flex items-center gap-1' href="/signin">
              Профіль
              <UserIcon className="h-5 w-5 text-darkmain" />
            </Link>
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default Header;
