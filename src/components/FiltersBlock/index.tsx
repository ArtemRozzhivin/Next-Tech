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
    <div className='w-1/2 flex flex-col bg-white rounded-md p-2'>
      <Disclosure defaultOpen>
        {({ open }) => (
          <div className='bg-white border-y border-gray-300 border-b-0 px-4 py-5 flex flex-col gap-5'>
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

      <Disclosure defaultOpen>
        {({ open }) => (
          <div className='bg-white border-y border-gray-300 px-4 py-5 flex flex-col gap-5'>
            <Disclosure.Button className='flex items-center w-full justify-between text-left text-sm font-medium hover:brightness-75'>
              <div>Бренд</div>

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
          </div>
        )}
      </Disclosure>
    </div>
  );
};

export default FiltersBlock;
