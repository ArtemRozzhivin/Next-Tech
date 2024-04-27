import Image from 'next/image';
import React from 'react';
import cx from 'clsx';
import largeTile from '@assets/largeTile.svg';
import smallTile from '@assets/smallTile.svg';

interface IToggleProductDisplay {
  handleGridLayout: (layout: string) => void;
  gridLayout: string;
}

const ToggleProductDisplay = ({ handleGridLayout, gridLayout }: IToggleProductDisplay) => {
  const [layout, setLayout] = React.useState<string>('large');

  const handleMobileToggleLayout = () => {
    const grid = layout === 'large' ? 'small' : 'large';

    handleGridLayout(grid);
    setLayout(grid);
  };

  return (
    <>
      <button
        onClick={handleMobileToggleLayout}
        className='sm:hidden inline-flex rounded-md border border-gray-300 shadow-lg px-3 md:px-4 py-2 bg-white text-sm font-medium hover:bg-gray-50  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-colorThird'>
        {layout === 'large' ? (
          <Image width={32} height={32} src={smallTile} alt='filter' className='w-6 h-6' />
        ) : (
          <Image width={32} height={32} src={largeTile} alt='filter' className='w-6 h-6' />
        )}
      </button>

      <div className='hidden sm:flex items-center gap-2 border border-gray-300 shadow-lg p-1 rounded-md'>
        <button
          onClick={() => handleGridLayout('large')}
          className={cx(
            'hover:bg-slate-100 hover:shadow-md transition-all rounded-md p-1',
            gridLayout === 'large' && 'bg-lightmain shadow-xl',
          )}>
          <Image width={32} height={32} src={largeTile} alt='filter' className='w-6 h-6' />
        </button>
        <button
          onClick={() => handleGridLayout('small')}
          className={cx(
            'hover:bg-slate-100 hover:shadow-md transition-all rounded-md p-1',
            gridLayout === 'small' && 'bg-lightmain shadow-lg',
          )}>
          <Image width={32} height={32} src={smallTile} alt='filter' className='w-6 h-6' />
        </button>
      </div>
    </>
  );
};

export default ToggleProductDisplay;
