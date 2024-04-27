import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface IFiltersReset {
  title?: string;
  onClick: () => void;
}

const FiltersReset = ({ title, onClick }: IFiltersReset) => {
  return (
    <button
      onClick={onClick}
      className='text-xs sm:text-base flex items-center justify-center gap-1 sm:gap-2 hover:text-red-700 transition-all'>
      <p className='whitespace-nowrap'>{title}</p>
      <XMarkIcon className='w-4 h-4 sm:w-5 sm:h-5' />
    </button>
  );
};

export default FiltersReset;
