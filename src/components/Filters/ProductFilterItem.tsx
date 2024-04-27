import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface IFiltersProductFilterItem {
  title?: string;
  value: string;
  onClick: () => void;
}

const FiltersProductFilterItem = ({ title, value, onClick }: IFiltersProductFilterItem) => {
  return (
    <button
      onClick={onClick}
      className='rounded-md inline-flex items-center gap-2 p-2 border border-gray-300 hover:bg-red-400 hover:border-red-500 group transition-all'>
      <div className='whitespace-nowrap text-xs sm:text-base group-hover:text-white transition-all'>
        {title && <span className='text-xs sm:text-sm'>{title}:</span>} <span>{value}</span>
      </div>
      <button className='hidden md:block bg-white p-[3px] rounded-full'>
        <XMarkIcon className='w-4 h-4 group-hover:text-red-800 transition-all' />
      </button>
    </button>
  );
};

export default FiltersProductFilterItem;
