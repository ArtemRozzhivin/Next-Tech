import { HomeIcon } from '@heroicons/react/24/outline';
import { Link } from '@src/navigation';
import { usePathname } from 'next/navigation';
import React from 'react';

interface IProductPage {
  children: React.ReactNode;
  title: string;
}

const ProductPage = ({ title, children }: IProductPage) => {
  const pathname = usePathname();

  console.log(pathname);
  return (
    <div>
      <div className='flex justify-start items-center gap-1'>
        <Link href='/' className='flex justify-center items-center gap-1 hover:text-colorMain'>
          <HomeIcon className='w-[18px] h-[18px]' /> Home
        </Link>
        <span>/</span>
        <span>{title}</span>
      </div>
      <h2 className='text-3xl'>{title}</h2>
      {children}
    </div>
  );
};

export default ProductPage;
