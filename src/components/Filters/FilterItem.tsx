import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import Checkbox from '@src/ui/Checkbox';

interface IFilterItem {
  title: string;
  options: any[];
  selectedOptions: any[];
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
                key={item}
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

export default FilterItem;
