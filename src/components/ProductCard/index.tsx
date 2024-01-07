'use client';

import { db } from '@src/firebaseConfig';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';
import Button from '@src/ui/Button';
// import { HeartIcon } from '@heroicons/react/24/outline';

const ProductCard = () => {
  return (
    <div>
      <div className='group border-gray-100/30 flex w-full max-w-xs flex-col self-center overflow-hidden rounded-lg border bg-darkmain shadow-md'>
        <div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
          <img
            className='peer absolute top-0 right-0 h-full w-full object-cover'
            src='https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60?a=b'
            alt='product image'
          />
          <img
            className='peer peer-hover:right-0 absolute top-0 -right-96 h-full w-full object-cover transition-all delay-100 duration-1000 hover:right-0'
            src='https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60'
            alt='product image'
          />
          <button>
            <HeartIcon className='text-colorMain w-8 h-8 absolute right-2 top-2' />
          </button>
        </div>
        <div className='mt-4 px-5 pb-5'>
          <a href='#'>
            <h5 className='text-xl tracking-tight text-lightmain'>Nike Air MX Super 2500 - Red</h5>
          </a>
          <div className='mt-2 mb-5 flex items-center justify-between'>
            <p>
              <span className='text-3xl font-bold text-lightmain'>$449</span>
            </p>
          </div>
          <Button
            primary
            className='w-full rounded-md border border-transparent bg-colorMain px-5 py-2.5 text-sm font-medium text-white'>
            <div className='w-full text-center flex items-center justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='mr-2 h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                stroke-width='2'>
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
              Add to cart
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
