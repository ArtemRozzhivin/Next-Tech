import { useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { XMarkIcon, ChevronUpIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Button from '@src/ui/Button';
import Input from '@src/ui/Input';
import React from 'react';
import Modal from '@src/ui/Modal';
import FilterItem from './FilterItem';

const brandOptions = ['ASUS', 'HP', 'LG', 'Toshiba', 'DELL', 'Samsung', 'MSI', 'Lenovo', 'Acer'];
const proccecorOptions = ['Intel', 'AMD', 'ARM'];
const dispalyOptions = ['11.6', '12.2', '13.3', '14', '15.6', '16', '17', '17.3'];
const ramOptions = [4, 8, 16, 32];
const coresOptions = [2, 4, 6, 8, 10, 12, 14, 16];
const osOptions = [
  'Windows 11 Pro',
  'Windows 11 Home',
  'Windows 10 Pro',
  'Windows 10 Home',
  'Windows 7 Pro',
  'Linux',
  'Chrome OS',
  'Endless OS',
  'eShell',
];

interface IFiltersMobileBlock {
  priceFrom: number;
  setPriceFrom: (value: number) => void;
  onResetPrice: () => void;
  priceTo: number;
  setPriceTo: (value: number) => void;
  onClickPrice: () => void;
  selectedBrand: any[];
  setSelectedBrand: (value: string) => void;

  selectedProcessor: any[];
  setSelectedProcessor: (value: string) => void;

  selectedDisplay: any[];
  setSelectedDisplay: (value: string) => void;

  selectedRam: any[];
  setSelectedRam: (value: string) => void;

  selectedOs: any[];
  setSelectedOs: (value: string) => void;

  selectedСore: any[];
  setSelectedСore: (value: string) => void;
}

const FiltersMobileBlock = ({
  priceFrom,
  setPriceFrom,
  onResetPrice,
  priceTo,
  setPriceTo,
  onClickPrice,
  selectedBrand,
  setSelectedBrand,
  selectedProcessor,
  setSelectedProcessor,
  selectedRam,
  setSelectedRam,
  selectedOs,
  setSelectedOs,
  selectedСore,
  setSelectedСore,
  selectedDisplay,
  setSelectedDisplay,
}: IFiltersMobileBlock) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleResetPrice = () => {
    onResetPrice();
  };

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleClickPrice = () => {
    setIsOpen(false);
    onClickPrice();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  return (
    <>
      <Button
        className='w-full rounded-md border border-gray-300 shadow-lg px-3 md:px-4 py-2 bg-white text-sm font-medium text-gray-700 dark:text-gray-50 dark:border-gray-800 dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-colorThird'
        onClick={handleToggleOpen}>
        <div className='flex items-center gap-1'>
          <FunnelIcon className='w-7 h-7' /> Фільтри
        </div>
      </Button>

      {isOpen && (
        <Modal
          className='mt-16 w-full'
          isOpened={true}
          onClose={() => setIsOpen(false)}
          size='full'>
          <div className='mb-2 flex justify-end'>
            <button className='p-2' onClick={() => setIsOpen(false)}>
              <XMarkIcon className='w-7 h-7' />
            </button>
          </div>

          <Disclosure defaultOpen>
            {({ open }) => (
              <div className='bg-white border-y border-gray-300 px-4 py-5 flex flex-col gap-5'>
                <Disclosure.Button className='flex items-center w-full justify-between text-left text-sm font-medium hover:brightness-75'>
                  <span>Ціна</span>
                  <div className='border border-gray-300 rounded-full p-1'>
                    <ChevronUpIcon
                      className={`${
                        open
                          ? 'rotate-180 transform transition-all'
                          : 'rotate-0 transform transition-all'
                      } h-5 w-5 text-gray-400`}
                    />
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className='flex flex-col gap-3 text-sm text-gray-500'>
                  <div className='flex justify-center items-center gap-2'>
                    <div>від</div>
                    <Input
                      value={priceFrom}
                      type='number'
                      onChange={(e) => setPriceFrom(Math.max(0, parseInt(e.target.value)))}
                    />
                    <div>до</div>
                    <Input
                      value={priceTo}
                      type='number'
                      onChange={(e) => setPriceTo(Math.max(0, parseInt(e.target.value)))}
                    />
                    {Number(priceFrom) > Number(priceTo) && (
                      <div className='text-red-600'>Число "Від" повинно бути меньше ніж "До"</div>
                    )}
                  </div>

                  {priceFrom !== 1 || priceTo !== 70000 ? (
                    <div className='flex items-center gap-2 w-full'>
                      <Button className='w-full' onClick={handleClickPrice} large primary>
                        Застосувати
                      </Button>
                      <Button className='w-full' onClick={handleResetPrice} large danger>
                        Скинути
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleClickPrice} large primary>
                      Застосувати
                    </Button>
                  )}
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>

          <FilterItem
            title='Бренд'
            options={brandOptions}
            selectedOptions={selectedBrand}
            onClickOption={(item) => setSelectedBrand(item)}
          />

          <FilterItem
            title='Діагональ екрану'
            options={dispalyOptions}
            selectedOptions={selectedDisplay}
            onClickOption={(item) => setSelectedDisplay(item)}
          />

          <FilterItem
            title='Виробник процесора'
            options={proccecorOptions}
            selectedOptions={selectedProcessor}
            onClickOption={(item) => setSelectedProcessor(item)}
          />

          <FilterItem
            title="Об'єм ОЗП"
            options={ramOptions}
            selectedOptions={selectedRam}
            onClickOption={(item) => setSelectedRam(item)}
          />

          <FilterItem
            title='Кількість ядер'
            options={coresOptions}
            selectedOptions={selectedСore}
            onClickOption={(item) => setSelectedСore(item)}
          />

          <FilterItem
            title='Операційна система'
            options={osOptions}
            selectedOptions={selectedOs}
            onClickOption={(item) => setSelectedOs(item)}
          />
        </Modal>
      )}
    </>
  );
};

export default FiltersMobileBlock;
