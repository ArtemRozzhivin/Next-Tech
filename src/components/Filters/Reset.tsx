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
      className='flex items-center justify-center gap-2 hover:text-red-700 transition-all'>
      <p>{title}</p>
      <XMarkIcon className='w-5 h-5' />
    </button>
  );
};

export default FiltersReset;
