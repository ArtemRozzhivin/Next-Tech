import { useEffect, useState } from 'react';
import { Disclosure, RadioGroup } from '@headlessui/react';
import { CheckIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Button from '@src/ui/Button';
import Input from '@src/ui/Input';
import React from 'react';
import Checkbox from '@src/ui/Checkbox';

interface IFiltersBlock {
  priceFrom: number;
  setPriceFrom: (value: number) => void;
  onResetPrice: () => void;
  priceTo: number;
  setPriceTo: (value: number) => void;
  onClickPrice: () => void;
  brandOptions: string[];
  selectedBrand: any[];
  setSelectedBrand: (value: string) => void;
}

const plans = [
  {
    name: 'Startup',
    ram: '12GB',
    cpus: '6 CPUs',
    disk: '160 GB SSD disk',
  },
  {
    name: 'Business',
    ram: '16GB',
    cpus: '8 CPUs',
    disk: '512 GB SSD disk',
  },
  {
    name: 'Enterprise',
    ram: '32GB',
    cpus: '12 CPUs',
    disk: '1024 GB SSD disk',
  },
];

const FiltersBlock = ({
  priceFrom,
  setPriceFrom,
  onResetPrice,
  priceTo,
  setPriceTo,
  onClickPrice,
  brandOptions,
  selectedBrand,
  setSelectedBrand,
}: IFiltersBlock) => {
  const handleResetPrice = () => {
    onResetPrice();
  };

  return (
    <div className='w-1/2 flex flex-col gap-3'>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className='flex w-full justify-between rounded-lg bg-colorThird px-4 py-2 text-left text-sm font-medium text-colorMain hover:brightness-95'>
              <span>Ціна</span>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform transition-all' : 'rotate-0 transform transition-all'
                } h-5 w-5 text-colorMain`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className='flex flex-col gap-3 text-sm text-gray-500'>
              <div className='flex items-center gap-2'>
                <div>від</div>
                <Input
                  value={priceFrom}
                  type='number'
                  onChange={(e) => setPriceFrom(Number(e.target.value))}
                />
                <div>до</div>
                <Input
                  value={priceTo}
                  type='number'
                  onChange={(e) => setPriceTo(Number(e.target.value))}
                />
              </div>

              {priceFrom !== 0 || priceTo !== 70000 ? (
                <div className='flex items-center gap-2 w-full'>
                  <Button onClick={onClickPrice} primary>
                    Застосувати
                  </Button>
                  <Button onClick={handleResetPrice} danger>
                    Скинути
                  </Button>
                </div>
              ) : (
                <Button onClick={onClickPrice} primary>
                  Застосувати
                </Button>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className='flex w-full justify-between rounded-lg bg-colorThird px-4 py-2 text-left text-sm font-medium text-colorMain hover:brightness-95'>
              <span>Бренд</span>
              <ChevronUpIcon
                className={`${
                  open ? 'rotate-180 transform transition-all' : 'rotate-0 transform transition-all'
                } h-5 w-5 text-colorMain`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className='flex flex-col gap-2 text-sm text-gray-500'>
              {brandOptions.map((brand) => (
                <Checkbox
                  checked={selectedBrand.includes(brand)}
                  onChange={() => setSelectedBrand(brand)}
                  name={brand}
                  id={brand}
                  label={brand}
                />
              ))}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default FiltersBlock;
