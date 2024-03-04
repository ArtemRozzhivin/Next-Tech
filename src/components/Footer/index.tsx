import Image from 'next/image';
import React, { memo } from 'react';
import Flag from 'react-flagkit';
import techLogo from '@assets/techLogo.png';

const Footer = (): JSX.Element => {
  const year = new Date().getFullYear();

  return (
    <footer className='bg-darkmain text-lightmain' aria-labelledby='footer-heading'>
      <h2 id='footer-heading' className='sr-only'>
        Footer
      </h2>
      <div className='w-11/12 pt-8 pb-5 px-4 sm:px-6 lg:px-8'>
        <div className='xl:grid xl:grid-cols-2 xl:gap-8'>
          <div className='space-y-5 xl:col-span-1'>
            <div className='flex gap-5 flex-wrap'>
              <Image src={techLogo} width={40} alt='logo' loading='lazy' />
              <span className='text-xl font-bold'>NextTech</span>
            </div>
            <p className='text-base'>
              <span className='text-lg'>Інтернет-магазин найкращої техніки</span>
              <br />
              <span>NextTech</span> - це сучасний інтернет-магазин, який пропонує вам найкращу
              техніку за найкращими цінами.
            </p>
            <p className='flex text-base'>
              Зроблено в Україні
              <a
                className='flex hover:underline hover:opacity-80 ml-1'
                href={`https://en.wikipedia.org/wiki/Ukraine`}
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Ukraine Wikipedia page (opens in a new tab)'>
                <Flag country='UA' size={18} alt='' aria-hidden='true' />
                &nbsp;
              </a>
            </p>
            <p className='text-base pt-10'>© 2023 NextTech. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
