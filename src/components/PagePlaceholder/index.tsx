import React from 'react';

interface IPagePlaceholder {
  icon: React.ReactNode;
  title: string;
  description: string;
  btn?: React.ReactNode;
}

const PagePlaceholder = ({ icon, title, description, btn }: IPagePlaceholder) => {
  return (
    <div className='flex flex-col justify-center items-center gap-3 text-center'>
      {icon}
      <div className='flex flex-col justify-center items-center gap-[2px] text-colorMain'>
        <h4>{title}</h4>
        <p className='text-sm'>{description}</p>
      </div>

      {!!btn && btn}
    </div>
  );
};

export default PagePlaceholder;
