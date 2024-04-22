import Image from 'next/image';
import React from 'react';
import techLogo from '@assets/techLogo.png';

const Loading = () => {
  return (
    <div className='w-screen h-screen flex justify-center items-center gap-3 sm:gap-5'>
      <Image src={techLogo} width={80} alt='logo' />
      <div className='flex flex-col gap-1 sm:gap-3'>
        <h3 className='font-bold text-lg sm:text-3xl uppercase leading-6'>Next Tech</h3>
        <div className='text-sm sm:text-lg leading-4 text-grayApp'>Магазин найкращої техніки</div>
      </div>
    </div>
  );
};

export default Loading;
