'use client';

import { ArrowsUpDownIcon, HomeIcon } from '@heroicons/react/24/outline';
import FiltersBlock from '@src/components/FiltersBlock';
import ProductsList, { IProductItem } from '@src/components/ProductsList';
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
import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

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
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchProduct, setSearchProduct] = useState<string>('');
  const [sortingValue, setSortingValue] = useState(sortingOptions[0]);

  const debouncedCallback = useDebouncedCallback((callback) => {
    callback();
  }, 1500);

  const fetchProducts = (customIndex: SearchIndex, value: string) => {
    console.log('fetchProducts', customIndex, value);

    let filterBrand = '';
    let filterPrice = `product.price:${priceFrom} TO ${priceTo}`;

    if (selectedBrands.length > 0) {
      filterBrand = selectedBrands.map((option) => `product.brand:${option}`).join(' OR ');
    }

    const filters = filterBrand ? `${filterPrice} AND ${filterBrand}` : filterPrice;

    customIndex.search(value, { filters: filters }).then(({ hits }) => {
      setLaptops(hits);
    });
  };

  const handleFetch = () => {
    fetchProducts(sortingValue.index, searchProduct);
  };

  const handleSearchProduct = (e: any) => {
    setSelectedBrands([]);
    setSearchProduct(e.target.value);

    debouncedCallback(() => fetchProducts(sortingValue.index, searchProduct));
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

  // const fetchLaptops = async () => {
  //   try {
  //     let q;

  //     if (selectedBrands.length === 0) {
  //       q = query(
  //         collection(db, 'laptops'),
  //         where('product.price', '>=', priceFrom),
  //         where('product.price', '<=', priceTo),
  //       );
  //     } else {
  //       q = query(
  //         collection(db, 'laptops'),
  //         where('product.price', '>=', priceFrom),
  //         where('product.price', '<=', priceTo),
  //         where('product.brand', 'in', selectedBrands),
  //       );
  //     }

  //     const querySnapshot = await getDocs(q);

  //     const dataArray = querySnapshot.docs.map((doc) => doc.data());

  //     setLaptops(dataArray as IProductItem[]);
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //   }
  // };

  useEffect(() => {
    handleFetch();
  }, [sortingValue, selectedBrands]);

  return (
    <div className='p-5 flex items-start gap-5'>
      <FiltersBlock
        priceFrom={priceFrom}
        setPriceFrom={setPriceFrom}
        priceTo={priceTo}
        setPriceTo={setPriceTo}
        onClickPrice={handleFetch}
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
            {/* <Search /> */}
            <Input value={searchProduct} onChange={handleSearchProduct} />

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
          </div>

          <ProductsList items={laptops} />
        </div>
      </div>
    </div>
  );
};

export default Laptops;
