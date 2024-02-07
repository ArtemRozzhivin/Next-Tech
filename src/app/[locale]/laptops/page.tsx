'use client';

import { ArrowsUpDownIcon, HomeIcon } from '@heroicons/react/24/outline';
import FiltersBlock from '@src/components/FiltersBlock';
import ProductsList, { IProductItem } from '@src/components/ProductsList';
import { db } from '@src/firebaseConfig';
import { Link } from '@src/navigation';
import Dropdown from '@src/ui/Dropdown';
import Input from '@src/ui/Input';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const brandOptions = ['MSI', 'Lenovo', 'Acer'];
const sortingOptions = [
  { title: 'Від дешевших до дорогих', method: 'asc' },
  { title: 'Від дорогих до дешевших', method: 'desc' },
];

const Laptops = () => {
  const [laptops, setLaptops] = useState<IProductItem[]>([]);
  const [priceFrom, setPriceFrom] = useState<number>(0);
  const [priceTo, setPriceTo] = useState<number>(70000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchProduct, setSearchProduct] = useState<string>('');
  const [sortingValue, setSortingValue] = useState(sortingOptions[0]);

  const debouncedCallback = useDebouncedCallback((callback) => {
    callback();
  }, 1500);

  const handleSearchProduct = (e: any) => {
    setSearchProduct(e.target.value);

    debouncedCallback(() => fetchLaptops(e.target.value));
  };

  const handleCheckboxChange = (value: string) => {
    if (selectedBrands.includes(value)) {
      setSelectedBrands(selectedBrands.filter((item) => item !== value));
    } else {
      setSelectedBrands([...selectedBrands, value]);
    }
  };

  const fetchLaptops = async (searchValue?: string) => {
    try {
      let q;

      if (selectedBrands.length === 0) {
        q = query(
          collection(db, 'laptops'),
          where('product.price', '>=', priceFrom),
          where('product.price', '<=', priceTo),
          orderBy('product.price', sortingValue.method),
        );
      } else {
        q = query(
          collection(db, 'laptops'),
          where('product.price', '>=', priceFrom),
          where('product.price', '<=', priceTo),
          where('product.brand', 'in', selectedBrands),
          orderBy('product.price', sortingValue.method),
        );
      }

      const querySnapshot = await getDocs(q);

      const dataArray = querySnapshot.docs.map((doc) => doc.data());

      console.log(dataArray);

      setLaptops(dataArray as IProductItem[]);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchLaptops();
  }, [selectedBrands, sortingValue]);

  return (
    <div className='p-5 flex items-start gap-5'>
      <FiltersBlock
        priceFrom={priceFrom}
        setPriceFrom={setPriceFrom}
        priceTo={priceTo}
        setPriceTo={setPriceTo}
        onClickPrice={fetchLaptops}
        selectedBrand={selectedBrands}
        setSelectedBrand={handleCheckboxChange}
        brandOptions={brandOptions}
      />
      <div className='flex flex-col gap-10'>
        <div>
          <div className='flex justify-start items-center gap-1'>
            <Link href='/' className='flex justify-center items-center gap-1 hover:text-colorMain'>
              <HomeIcon className='w-[18px] h-[18px]' /> Home
            </Link>
            <span>/</span>
            <span>Laptops</span>
          </div>
          <h2 className='text-3xl'>Laptops</h2>
        </div>

        <div className='flex flex-col gap-5'>
          <div className='flex items-center gap-5 justify-between'>
            <Input
              value={searchProduct}
              onChange={handleSearchProduct}
              placeholder='Введіть назву'
            />

            <Dropdown
              className='inline-flex shadow-lg'
              title={
                <div className='flex items-center gap-1'>
                  {sortingValue.title}
                  <ArrowsUpDownIcon className='w-6 h-6' />
                </div>
              }
              items={sortingOptions}
              keyExtractor={(item) => item.title}
              labelExtractor={(item) => item.title}
              onSelect={(item) => setSortingValue(item)}
            />
          </div>

          <ProductsList items={laptops} />
        </div>
      </div>
    </div>
  );
};

export default Laptops;
