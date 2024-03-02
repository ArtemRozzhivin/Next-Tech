'use client';

import {
  ArrowsUpDownIcon,
  HomeIcon,
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import FiltersBlock from '@src/components/FiltersBlock';
import ProductsList from '@src/components/ProductsList';
import { Search } from '@src/components/Search';
import { db } from '@src/firebaseConfig';
import { Link } from '@src/navigation';
import Button from '@src/ui/Button';
import Dropdown from '@src/ui/Dropdown';
import Input from '@src/ui/Input';
import { fetchSmarhphonesToFireBase } from '@src/utils/fetchProductToFirebase';
import algoliasearch, { SearchIndex } from 'algoliasearch';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { set } from 'lodash';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import largeTile from '@assets/largeTile.svg';
import smallTile from '@assets/smallTile.svg';
import cx from 'clsx';
import ProductFilterItem from '@src/components/ProductFilterItem';
import { IProductItem } from '@src/redux/models';

const client = algoliasearch('Q2QOIT41TW', '09737b1233e8e42a12c90f0a08a08dd6');
const index = client.initIndex('product_search');
const descPriceIndex = client.initIndex('product_search_price_desc');
const ascPriceIndex = client.initIndex('product_search_price_asc');

const brandOptions = ['MSI', 'Lenovo', 'Acer'];
const sortingOptions = [
  { title: 'Популярні', method: 'desc', index: index },
  { title: 'Від дешевших до дорогих', method: 'asc', index: ascPriceIndex },
  { title: 'Від дорогих до дешевших', method: 'desc', index: descPriceIndex },
];

const Laptops = () => {
  const [laptops, setLaptops] = useState<IProductItem[]>([]);
  const [priceFrom, setPriceFrom] = useState<number>(0);
  const [priceTo, setPriceTo] = useState<number>(70000);
  const [acceptedPrice, setAcceptedPrice] = useState<{ from: number; to: number } | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchProduct, setSearchProduct] = useState<string>('');
  const [sortingValue, setSortingValue] = useState(sortingOptions[0]);
  const [gridLayout, setGridLayout] = useState<string>('large');

  const debouncedCallback = useDebouncedCallback((callback) => {
    callback();
  }, 1500);

  const fetchProducts = (customIndex: SearchIndex, value: string) => {
    let filterBrand = '';
    let filterPrice = `product.price:${priceFrom} TO ${priceTo}`;

    if (selectedBrands.length > 0) {
      filterBrand = selectedBrands.map((option) => `product.brand:${option}`).join(' OR ');
    }

    const filters = filterBrand ? `${filterPrice} AND ${filterBrand}` : filterPrice;
    console.log(filters, 'filters');

    customIndex.search(value, { filters: filters }).then(({ hits }) => {
      setLaptops(hits);
    });
  };

  const handleFetch = () => {
    if (searchProduct !== '') return;
    fetchProducts(sortingValue.index, searchProduct);
  };

  const handleClickPrice = () => {
    handleFetch();
    setAcceptedPrice({ from: priceFrom, to: priceTo });
  };

  const handleResetPrice = () => {
    setAcceptedPrice(null);
    setPriceFrom(0);
    setPriceTo(70000);
  };

  const handleSearchProduct = (e: any) => {
    setSearchProduct(e.target.value);

    debouncedCallback(() => {
      setSelectedBrands([]);
      fetchProducts(sortingValue.index, searchProduct);
    });
  };

  const handleSorting = async (sort: any) => {
    setSortingValue(sort);
  };

  const handleCheckboxChange = (value: string) => {
    if (selectedBrands.includes(value)) {
      setSelectedBrands(selectedBrands.filter((item) => item !== value));
    } else {
      setSelectedBrands([...selectedBrands, value]);
      setSearchProduct('');
    }
  };

  const handleClearSearchProduct = () => {
    setSearchProduct('');
    fetchProducts(sortingValue.index, '');
  };

  const handleGridLayout = (value: string) => {
    setGridLayout(value);
  };

  useEffect(() => {
    handleFetch();
  }, [sortingValue, selectedBrands, acceptedPrice]);

  return (
    <div className='p-5 flex items-start gap-5'>
      <FiltersBlock
        priceFrom={priceFrom}
        setPriceFrom={setPriceFrom}
        onResetPrice={handleResetPrice}
        priceTo={priceTo}
        setPriceTo={setPriceTo}
        onClickPrice={handleClickPrice}
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
              icon={<MagnifyingGlassIcon className='w-6 h-6 text-colorMain' />}
              clearIcon
              onClear={handleClearSearchProduct}
              label='Пошук товарів'
              placeholder='Введіть назву товару'
              value={searchProduct}
              onChange={handleSearchProduct}
              className='shadow-lg w-1/2'
            />

            <div className='flex items-center gap-3'>
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
                onSelect={(item) => handleSorting(item)}
              />

              <div className='flex items-center gap-2 border border-gray-400 shadow-lg p-1 rounded-md'>
                <button
                  onClick={() => handleGridLayout('large')}
                  className={cx(
                    'hover:bg-slate-100 hover:shadow-md transition-all rounded-md p-1',
                    gridLayout === 'large' && 'bg-white shadow-xl',
                  )}>
                  <Image width={32} height={32} src={largeTile} alt='filter' className='w-6 h-6' />
                </button>
                <button
                  onClick={() => handleGridLayout('small')}
                  className={cx(
                    'hover:bg-slate-100 hover:shadow-md transition-all rounded-md p-1',
                    gridLayout === 'small' && 'bg-white shadow-lg',
                  )}>
                  <Image width={32} height={32} src={smallTile} alt='filter' className='w-6 h-6' />
                </button>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            {acceptedPrice !== null && (
              <ProductFilterItem
                title='Ціна'
                value={`${acceptedPrice.from} - ${acceptedPrice.to} грн`}
                onClick={handleResetPrice}
              />
            )}
            <div className='flex items-center gap-2'>
              {selectedBrands.length > 0 &&
                selectedBrands.map((item) => (
                  <ProductFilterItem
                    key={item}
                    value={item}
                    onClick={() => handleCheckboxChange(item)}
                  />
                ))}
            </div>
          </div>

          <ProductsList gridLayout={gridLayout} items={laptops} />
        </div>
      </div>
    </div>
  );
};

export default Laptops;
