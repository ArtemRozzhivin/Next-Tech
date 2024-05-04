'use client';

import { ArrowsUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import FiltersBlock from '@src/components/Filters/Block';
import ProductsList from '@src/components/Product/List';
import Dropdown from '@src/ui/Dropdown';
import Input from '@src/ui/Input';
import algoliasearch, { SearchIndex } from 'algoliasearch';
import React, { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import ProductFilterItem from '@src/components/Filters/ProductFilterItem';
import { IProductItem } from '@src/redux/models';
import СustomPagination from '@src/ui/Pagination';
import ResetFilters from '@src/components/Filters/Reset';
import Loader from '@src/components/Loader';
import ToggleProductDisplay from '@src/components/ToggleProductDisplay';
import FiltersMobileBlock from '@src/components/Filters/MobileBlock';
import PagePlaceholder from '@src/components/PagePlaceholder';

const algoliaApplicationId = process.env.NEXT_PUBLIC_APPLICATION_ID as string;
const algoliaSearchApiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY as string;

const client = algoliasearch(algoliaApplicationId, algoliaSearchApiKey);
const index = client.initIndex('product_search');
const descPriceIndex = client.initIndex('product_search_price_desc');
const ascPriceIndex = client.initIndex('product_search_price_asc');

interface ISortingOption {
  title: string;
  method: string;
  index: SearchIndex;
  name: string;
}

const sortingOptions: ISortingOption[] = [
  { title: 'Популярні', method: 'desc', index: index, name: 'prpduct_search' },
  {
    title: 'Від дешевших до дорогих',
    method: 'asc',
    index: ascPriceIndex,
    name: 'product_search_price_asc',
  },
  {
    title: 'Від дорогих до дешевших',
    method: 'desc',
    index: descPriceIndex,
    name: 'product_search_price_desc',
  },
];

const PageTitleItem = ({ items, title }: { items: string[]; title: string }) => {
  return (
    <>
      {items.length > 0 && (
        <span className='flex items-center gap-2'>
          <span>{title}:</span>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <span>
                {item}
                {index < items.length - 1 && <span>,</span>}
                {index === items.length - 1 && <span>;</span>}
              </span>
            </React.Fragment>
          ))}
        </span>
      )}
    </>
  );
};

interface iPageTitle {
  searchProduct: string;
  selectedBrands: string[];
  selectedDisplay: string[];
  selectedProcessor: string[];
  selectedRam: string[];
  selectedOs: string[];
  selectedСore: string[];
}

const PageTitle = ({
  searchProduct,
  selectedBrands,
  selectedDisplay,
  selectedProcessor,
  selectedRam,
  selectedOs,
  selectedСore,
}: iPageTitle) => {
  return (
    <span className='py-2 text-lg md:text-3xl inline-flex items-center flex-wrap gap-2'>
      <span>Ноутбуки </span>

      {searchProduct !== '' && <span>по запиту: "{searchProduct}"</span>}

      <PageTitleItem items={selectedBrands} title='від' />

      <PageTitleItem items={selectedDisplay} title='Діагональ екрану' />

      <PageTitleItem items={selectedProcessor} title='Виробник процесора' />

      <PageTitleItem items={selectedRam} title="Об'єм ОЗП" />

      <PageTitleItem items={selectedСore} title='Кількість ядер' />

      <PageTitleItem items={selectedOs} title='Операційна система' />
    </span>
  );
};

const Laptops = () => {
  const [laptops, setLaptops] = useState<IProductItem[]>([]);
  const [priceFrom, setPriceFrom] = useState<number>(1);
  const [priceTo, setPriceTo] = useState<number>(70000);
  const [acceptedPrice, setAcceptedPrice] = useState<{ from: number; to: number } | null>(null);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedProcessor, setSelectedProcessor] = useState<string[]>([]);
  const [selectedDisplay, setSelectedDisplay] = useState<string[]>([]);
  const [selectedRam, setSelectedRam] = useState<string[]>([]);
  const [selectedOs, setSelectedOs] = useState<string[]>([]);
  const [selectedСore, setSelectedСore] = useState<string[]>([]);

  const [searchProduct, setSearchProduct] = useState<string>('');
  const [sortingValue, setSortingValue] = useState(sortingOptions[0]);
  const [gridLayout, setGridLayout] = useState<string>('large');

  const [currentPage, setCurrentPage] = useState<number | null>(0);
  const [pagination, setPagination] = useState<{ nbPages: number; page: number } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const debouncedCallback = useDebouncedCallback((callback) => {
    callback();
  }, 1500);

  const fetchProducts = (customIndex: SearchIndex, value: string) => {
    setLoading(true);
    const filtersArray: string[] = [];
    const filterPrice = `product.price:${priceFrom} TO ${priceTo}`;

    if (selectedBrands.length > 0) {
      filtersArray.push(selectedBrands.map((option) => `product.brand:${option}`).join(' OR '));
    }

    if (selectedProcessor.length > 0) {
      filtersArray.push(
        selectedProcessor.map((option) => `product.processor:${option}`).join(' OR '),
      );
    }

    if (selectedDisplay.length > 0) {
      filtersArray.push(selectedDisplay.map((option) => `product.display:${option}`).join(' OR '));
    }

    if (selectedRam.length > 0) {
      filtersArray.push(selectedRam.map((option) => `product.ram:${option}`).join(' OR '));
    }

    if (selectedOs.length > 0) {
      filtersArray.push(selectedOs.map((option) => `product.os:"${option}"`).join(' OR '));
    }

    if (selectedСore.length > 0) {
      filtersArray.push(selectedСore.map((option) => `product.cores:${option}`).join(' OR '));
    }

    let filters = filterPrice;
    if (filtersArray.length > 0) {
      filters += ` AND ${filtersArray.join(' AND ')}`;
    }

    customIndex
      .search(value, { page: currentPage, hitsPerPage: 15, filters: value ? filterPrice : filters })
      .then((response) => {
        setPagination({
          nbPages: response.nbPages,
          page: response.page,
        });

        setLaptops(response.hits);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFetch = () => {
    if (searchProduct !== '') return;
    fetchProducts(sortingValue.index, searchProduct);
  };

  const handleClickPrice = () => {
    if (priceFrom < 0 || priceTo < 0) {
      return;
    } else if (priceFrom > priceTo) {
      return;
    }

    handleFetch();
    setAcceptedPrice({ from: priceFrom, to: priceTo });
  };

  const handleResetPrice = () => {
    setAcceptedPrice(null);
    setPriceFrom(1);
    setPriceTo(70000);
  };

  const handleResetFilters = () => {
    handleResetPrice();
    setSelectedBrands([]);
    setSelectedProcessor([]);
    setSelectedDisplay([]);
    setSelectedRam([]);
    setSelectedOs([]);
    setSelectedСore([]);
  };

  const handleSearchProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchProduct(e.target.value);

    debouncedCallback(() => {
      handleResetFilters();
      fetchProducts(sortingValue.index, e.target.value);
    });
  };

  const handleSorting = async (sort: ISortingOption) => {
    setSortingValue(sort);
  };

  const handleCheckboxChange = (
    selectedOptions: string[],
    setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
  ) => {
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
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

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    handleFetch();
  }, [
    searchProduct,
    sortingValue,
    selectedBrands,
    selectedDisplay,
    selectedOs,
    selectedProcessor,
    selectedRam,
    selectedСore,
    acceptedPrice,
    currentPage,
  ]);

  return (
    <div className='w-full max-w-[1536px] flex justify-center items-center mx-auto'>
      <div className='sm:p-5 flex flex-col gap-2 sm:gap-5'>
        <div className='hidden md:block'>
          <PageTitle
            searchProduct={searchProduct}
            selectedBrands={selectedBrands}
            selectedDisplay={selectedDisplay}
            selectedProcessor={selectedProcessor}
            selectedRam={selectedRam}
            selectedOs={selectedOs}
            selectedСore={selectedСore}
          />
        </div>

        <div className='pt-2 text-lg block md:hidden'>Ноутбуки</div>

        <div className='border-t border-gray-300 h-full flex items-start gap-5'>
          <div className='hidden lg:block w-1/2'>
            <FiltersBlock
              priceFrom={priceFrom}
              setPriceFrom={setPriceFrom}
              onResetPrice={handleResetPrice}
              acceptedPrice={acceptedPrice}
              priceTo={priceTo}
              setPriceTo={setPriceTo}
              onClickPrice={handleClickPrice}
              selectedBrand={selectedBrands}
              setSelectedBrand={(value) =>
                handleCheckboxChange(selectedBrands, setSelectedBrands, value)
              }
              selectedProcessor={selectedProcessor}
              setSelectedProcessor={(value) =>
                handleCheckboxChange(selectedProcessor, setSelectedProcessor, value)
              }
              selectedDisplay={selectedDisplay}
              setSelectedDisplay={(value) =>
                handleCheckboxChange(selectedDisplay, setSelectedDisplay, value)
              }
              selectedRam={selectedRam}
              setSelectedRam={(value) => handleCheckboxChange(selectedRam, setSelectedRam, value)}
              selectedOs={selectedOs}
              setSelectedOs={(value) => handleCheckboxChange(selectedOs, setSelectedOs, value)}
              selectedСore={selectedСore}
              setSelectedСore={(value) =>
                handleCheckboxChange(selectedСore, setSelectedСore, value)
              }
            />
          </div>

          <div className='flex flex-col gap-1'>
            <div className='bg-white py-3 rounded-md sm:flex items-center gap-1 sm:gap-5 justify-between'>
              <div className='flex-1'>
                <Input
                  icon={<MagnifyingGlassIcon className='w-6 h-6 text-colorMain' />}
                  clearIcon
                  onClear={handleClearSearchProduct}
                  placeholder='Введіть назву товару'
                  value={searchProduct}
                  onChange={handleSearchProduct}
                  className='shadow-lg my-2 sm:my-0'
                />
              </div>

              <div className='flex justify-between md:justify-normal items-center gap-[6px] sm:gap-3'>
                <div className='lg:hidden block'>
                  <FiltersMobileBlock
                    priceFrom={priceFrom}
                    setPriceFrom={setPriceFrom}
                    onResetPrice={handleResetPrice}
                    acceptedPrice={acceptedPrice}
                    priceTo={priceTo}
                    setPriceTo={setPriceTo}
                    onClickPrice={handleClickPrice}
                    selectedBrand={selectedBrands}
                    setSelectedBrand={(value) =>
                      handleCheckboxChange(selectedBrands, setSelectedBrands, value)
                    }
                    selectedProcessor={selectedProcessor}
                    setSelectedProcessor={(value) =>
                      handleCheckboxChange(selectedProcessor, setSelectedProcessor, value)
                    }
                    selectedDisplay={selectedDisplay}
                    setSelectedDisplay={(value) =>
                      handleCheckboxChange(selectedDisplay, setSelectedDisplay, value)
                    }
                    selectedRam={selectedRam}
                    setSelectedRam={(value) =>
                      handleCheckboxChange(selectedRam, setSelectedRam, value)
                    }
                    selectedOs={selectedOs}
                    setSelectedOs={(value) =>
                      handleCheckboxChange(selectedOs, setSelectedOs, value)
                    }
                    selectedСore={selectedСore}
                    setSelectedСore={(value) =>
                      handleCheckboxChange(selectedСore, setSelectedСore, value)
                    }
                  />
                </div>

                <div className='flex items-center gap-[6px] sm:gap-3'>
                  <ToggleProductDisplay
                    gridLayout={gridLayout}
                    handleGridLayout={handleGridLayout}
                  />

                  <Dropdown
                    className='inline-flex shadow-lg'
                    title={
                      <div className='flex items-center gap-1'>
                        <span className='hidden sm:inline'>{sortingValue.title}</span>
                        <ArrowsUpDownIcon className='w-6 h-6' />
                      </div>
                    }
                    items={sortingOptions}
                    keyExtractor={(item) => item.title}
                    labelExtractor={(item) => item.title}
                    onSelect={(item) => handleSorting(item)}
                  />
                </div>
              </div>
            </div>
            <div className='my-2 md:my-0 py-2 flex md:flex-wrap items-center gap-1 md:gap-2 overflow-x-auto w-[95vw] md:w-full'>
              {acceptedPrice !== null && (
                <ProductFilterItem
                  title='Ціна'
                  value={`${acceptedPrice.from} - ${acceptedPrice.to} грн`}
                  onClick={handleResetPrice}
                />
              )}
              {selectedBrands.length > 0 && (
                <div className='flex items-center gap-1 md:gap-2'>
                  {selectedBrands.map((item) => (
                    <ProductFilterItem
                      title='Бренд'
                      key={item}
                      value={item}
                      onClick={() => handleCheckboxChange(selectedBrands, setSelectedBrands, item)}
                    />
                  ))}
                </div>
              )}

              {selectedDisplay.length > 0 && (
                <div className='flex items-center gap-2'>
                  {selectedDisplay.map((item) => (
                    <ProductFilterItem
                      title='Діагональ екрану'
                      key={item}
                      value={item}
                      onClick={() =>
                        handleCheckboxChange(selectedDisplay, setSelectedDisplay, item)
                      }
                    />
                  ))}
                </div>
              )}

              {selectedProcessor.length > 0 && (
                <div className='flex items-center gap-2'>
                  {selectedProcessor.map((item) => (
                    <ProductFilterItem
                      title='Виробник процесора'
                      key={item}
                      value={item}
                      onClick={() =>
                        handleCheckboxChange(selectedProcessor, setSelectedProcessor, item)
                      }
                    />
                  ))}
                </div>
              )}

              {selectedRam.length > 0 && (
                <div className='flex items-center gap-2'>
                  {selectedRam.map((item) => (
                    <ProductFilterItem
                      title="Об'єм ОЗП"
                      key={item}
                      value={item}
                      onClick={() => handleCheckboxChange(selectedRam, setSelectedRam, item)}
                    />
                  ))}
                </div>
              )}

              {selectedСore.length > 0 && (
                <div className='flex items-center gap-2'>
                  {selectedСore.map((item) => (
                    <ProductFilterItem
                      title='Кількість ядер'
                      key={item}
                      value={item}
                      onClick={() => handleCheckboxChange(selectedСore, setSelectedСore, item)}
                    />
                  ))}
                </div>
              )}

              {selectedOs.length > 0 && (
                <div className='flex items-center gap-2'>
                  {selectedOs.map((item) => (
                    <ProductFilterItem
                      title='Операційна система'
                      key={item}
                      value={item}
                      onClick={() => handleCheckboxChange(selectedOs, setSelectedOs, item)}
                    />
                  ))}
                </div>
              )}

              {(acceptedPrice !== null || selectedBrands.length > 0) && (
                <ResetFilters title='Скинути фільтри' onClick={handleResetFilters} />
              )}
            </div>

            {loading ? (
              <div className='py-20'>
                <Loader />
              </div>
            ) : (
              <>
                {laptops.length === 0 ? (
                  <PagePlaceholder
                    title='Товарів не знайдено'
                    description='Спробуйте змінити параметри фільтрації або скиньте фільтри для перегляду доступних товарів'
                  />
                ) : (
                  <ProductsList gridLayout={gridLayout} items={laptops} />
                )}
              </>
            )}

            {laptops.length > 0 && (
              <div className='flex justify-center items-center py-5'>
                <СustomPagination allPages={pagination?.nbPages} onChange={handleChangePage} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Laptops;
