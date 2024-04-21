import { useEffect, useState } from 'react';
import { Disclosure, RadioGroup } from '@headlessui/react';
import { CheckIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Button from '@src/ui/Button';
import Input from '@src/ui/Input';
import React from 'react';
import Checkbox from '@src/ui/Checkbox';

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

interface IFilterItem {
  title: string;
  options: string[];
  selectedOptions: string;
  onClickOption: (value: string) => void;
}

const FilterItem = ({ title, options, selectedOptions, onClickOption }: IFilterItem) => {
  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <div className='bg-white border-b border-gray-300 px-4 py-5 flex flex-col gap-5'>
          <Disclosure.Button className='flex items-center w-full justify-between text-left text-sm font-medium hover:brightness-75'>
            <div>{title}</div>

            <div className='border border-gray-300 rounded-full p-1'>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform transition-all' : 'rotate-0 transform transition-all'
                } h-5 w-5 text-gray-400`}
              />
            </div>
          </Disclosure.Button>
          <Disclosure.Panel className='flex flex-col gap-2 text-sm text-gray-500'>
            {options.map((item) => (
              <Checkbox
                checked={selectedOptions.includes(item)}
                onChange={() => onClickOption(item)}
                name={item}
                id={item}
                label={item}
              />
            ))}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};

interface IFiltersBlock {
  priceFrom: number;
  setPriceFrom: (value: number) => void;
  onResetPrice: () => void;
  acceptedPrice: { from: number; to: number };
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

const FiltersBlock = ({
  priceFrom,
  setPriceFrom,
  onResetPrice,
  acceptedPrice,
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
}: IFiltersBlock) => {
  const handleResetPrice = () => {
    onResetPrice();
  };

  return (
    <div className='flex flex-col bg-white rounded-md'>
      <Disclosure defaultOpen>
        {({ open }) => (
          <div className='bg-white border-b border-gray-300 px-4 py-5 flex flex-col gap-5'>
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
              <div className='flex items-center gap-2'>
                <div>від</div>
                <Input
                  value={priceFrom}
                  type='number'
                  onChange={(e) => setPriceFrom(Math.max(0, e.target.value))}
                />
                <div>до</div>
                <Input
                  value={priceTo}
                  type='number'
                  onChange={(e) => setPriceTo(Math.max(0, e.target.value))}
                />
                {Number(priceFrom) > Number(priceTo) && <div className='text-red-600'>dsfdsf</div>}
              </div>

              {priceFrom !== 1 || priceTo !== 70000 ? (
                <div className='flex items-center gap-2 w-full'>
                  <Button className='w-full' onClick={onClickPrice} large primary>
                    Застосувати
                  </Button>
                  <Button className='w-full' onClick={handleResetPrice} large danger>
                    Скинути
                  </Button>
                </div>
              ) : (
                <Button onClick={onClickPrice} large primary>
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
    </div>
  );
};

export default FiltersBlock;
