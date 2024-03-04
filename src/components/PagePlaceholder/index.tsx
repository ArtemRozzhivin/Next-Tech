import { FaceFrownIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface IPagePlaceholder {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  btn?: React.ReactNode;
}

const PagePlaceholder = ({ icon, title, description, btn }: IPagePlaceholder) => {
  return (
    <div className='flex flex-col justify-center items-center gap-1 text-center'>
      {icon ? icon : <FaceFrownIcon className='text-colorMain w-20 h-20' />}
      <div className='flex flex-col justify-center items-center gap-[2px]'>
        <h4 className='text-2xl font-semibold'>{title}</h4>
        {description && <p className='text-lg'>{description}</p>}
      </div>

      {!!btn && btn}
    </div>
  );
};

export default PagePlaceholder;
