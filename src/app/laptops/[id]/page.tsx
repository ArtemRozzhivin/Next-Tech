'use client';

import { Tab } from '@headlessui/react';
import axios from 'axios';
import Image from 'next/image';
import React, { ReactNode, useEffect, useState } from 'react';
import cx from 'clsx';
import Button from '@src/ui/Button';
import { ArrowLeftIcon, HeartIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import { selectCartItemById } from '@src/redux/reducers/Products/selectors';
import { IProductCartItem, IProductItem } from '@src/redux/models';
import { productsActions } from '@src/redux/reducers/Products/products';
import { handleAddToWishList } from '@src/api/products';
import AddedProductModal from '@src/components/Modals/AddedProductModal';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Loader from '@src/components/Loader';
import algoliasearch from 'algoliasearch';
import MustAuthModal from '@src/components/Modals/MustAuthModal';

interface IProductDetail {
  product: {
    dedupe: string;
    is_translated: boolean;
    alias: string;
    part_number: string;
    brand: string;
    family: string;
    series: string;
    version: string;
    model: string;
    category: string;
    'ean/upc_code': string;
    id: string;
  };
  date: {
    released: string;
  };
  image: {
    thumbnail: string;
    large: string;
  };
  key_aspects: {
    release_date: string;
    ram: string;
    storage: string;
    processor: string;
    integrated_graphics_card: string;
    battery: string;
  };
  design: {
    body: {
      type: string;
      style: string;
      colors: string;
      'width_(longer_side)': string;
      weight: string;
      'height_(shorter_side)': string;
      thickness: string;
    };
    keyboard: {
      additional_features: string;
    };
    touchpad: {
      pointing_device: string;
    };
    security: {
      lock_slot_type: string;
      additional_features: string;
    };
  };
  display: {
    type: string;
    definition: string;
    diagonal: string;
    'resolution_(h_x_w)': string;
    aspect_ratio: string;
    refresh_rate: string;
    additional_features: string;
  };
  camera?: {
    front_camera?: {
      definition: string;
      'resolution_(h_x_w)': string;
      additional_features: string;
    };
  };
  inside: {
    cpu?: {
      number_of_cores: string;
      brand: string;
      model: string;
      generation: string;
      family: string;
      cache: string;
      'configurable_tdp_(thermal_design_power)_up': string;
      'configurable_tdp_(thermal_design_power)_up_frequency': string;
    };
    ram?: {
      capacity: string;
      maximum_capacity: string;
      type: string;
      clock_speed: string;
      form_factor: string;
    };
    gpu?: {
      integrated_card_model: string;
      additional_features: string;
    };
    storage?: {
      total_capacity: string;
    };
    ssd?: {
      capacity: string;
      total_ssd_capacity: string;
      number_of_ssds: string;
      storage_type: string;
      ssd_interface: string;
    };
    battery?: {
      'capacity_(mah)': string;
      life: string;
      number_of_cells: string;
      type: string;
    };
    power?: {
      power: string;
    };
    wireless?: {
      wifi_standards: string;
      bluetooth_version: string;
      additional_features: string;
    };
    wired?: {
      ethernet_speed: string;
      additional_features: string;
    };
    audio?: {
      number_of_speakers: string;
      additional_features: string;
    };
    software?: {
      operating_system_version: string;
      operating_system_bit_version: string;
    };
    ports?: {
      'number_of_usb_3,2_gen_1_type_a_ports': string;
      number_of_hdmi_ports: string;
      'number_of_usb_2,0_ports': string;
      'number_of_ethernet_lan_(rj-45)_ports': string;
      charging: string;
    };
  };
  no: {
    touchscreen: string;
    dedicated_card: string;
  };
  No: {
    Touchscreen: string;
    Dedicated_Card: string;
  };
}

const InfoBlock = ({ title, info }: { title: string; info: string | null | undefined }) => {
  return (
    <>
      {info ? (
        <div className='text-xs flex items-start justify-between'>
          <div className='flex-1 flex items-end'>
            {title}
            <div className='flex-1 border-b-2 border-dashed'></div>
          </div>
          <div className='text-right'>{info}</div>
        </div>
      ) : null}
    </>
  );
};

const CharacteristicsItem = ({ title, info }: { title: string; info: ReactNode[] }) => {
  return (
    <div className='flex flex-col gap-1'>
      <h2 className='text-lg sm:text-xl font-medium'>{title}</h2>
      <div className='flex flex-col gap-1'>
        {info.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </div>
  );
};

const CharacteristicsBlock = ({ product }: { product: IProductDetail }) => {
  return (
    <div>
      <h2 className='text-xl mb-2 sm:mb-6 sm:text-2xl font-semibold'>
        Характеристики {product?.product.model}
      </h2>

      <div className='flex flex-col gap-5'>
        <CharacteristicsItem
          title='Екран'
          info={[
            <InfoBlock title='Діагональ екрану' info={product?.display?.diagonal} />,
            <InfoBlock
              title='Роздільна здатність екрану'
              info={`${product?.display['resolution_(h_x_w)']} ${product?.display?.definition}`}
            />,
            <InfoBlock title='Частота оновлення екрану' info={product?.display?.refresh_rate} />,
            <InfoBlock title='Тип матриці' info={product?.display?.type} />,
          ]}
        />

        <CharacteristicsItem
          title='Корпус'
          info={[
            <InfoBlock title='Ширина' info={product?.design?.body?.['width_(longer_side)']} />,
            <InfoBlock title='Висота' info={product?.design?.body?.['height_(shorter_side)']} />,
            <InfoBlock title='Товщина' info={product?.design?.body?.thickness} />,
            <InfoBlock title='Вага' info={product?.design?.body?.weight} />,
          ]}
        />

        <CharacteristicsItem
          title='Камера'
          info={[
            <InfoBlock
              title='Особливості'
              info={product?.camera?.front_camera?.additional_features}
            />,
            <InfoBlock
              title='Роздільна здатність'
              info={product?.camera?.front_camera?.definition}
            />,
            <InfoBlock
              title='Роздільна здатність (висота x ширина)'
              info={product?.camera?.front_camera?.['resolution_(h_x_w)']}
            />,
          ]}
        />

        <CharacteristicsItem
          title='Відеокарта'
          info={[
            <InfoBlock title='Модель' info={product?.inside?.gpu?.integrated_card_model} />,
            <InfoBlock title='Особливості' info={product?.inside?.gpu?.additional_features} />,
          ]}
        />

        <CharacteristicsItem
          title='Процесор'
          info={[
            <InfoBlock
              title='Процесор'
              info={`${product?.inside?.cpu?.family} ${product?.inside?.cpu?.model}`}
            />,
            <InfoBlock title='Покоління' info={product?.inside?.cpu?.generation} />,
            <InfoBlock title='Кількість ядер' info={product?.inside?.cpu?.number_of_cores} />,
          ]}
        />

        <CharacteristicsItem
          title="Оперативна пам'ять"
          info={[
            <InfoBlock title="Обсяг оперативної пам'яті" info={product?.inside?.ram?.capacity} />,
            <InfoBlock title="Тип оперативної пам'яті" info={product?.inside?.ram?.type} />,
            <InfoBlock
              title="Характеристики оперативної пам'яті"
              info={product?.inside?.ram?.clock_speed}
            />,
          ]}
        />

        <CharacteristicsItem
          title='Жорсткий диск'
          info={[
            <InfoBlock title='Тип накопичувача' info={product?.inside?.ssd?.storage_type} />,
            <InfoBlock
              title='Кількість накопичувачів'
              info={product?.inside?.ssd?.number_of_ssds}
            />,
            <InfoBlock
              title="Об'єм накопичувача"
              info={product?.inside?.ssd?.total_ssd_capacity}
            />,
          ]}
        />

        <CharacteristicsItem
          title='Аудіо'
          info={[
            <InfoBlock
              title='Кількість динаміків'
              info={product?.inside?.audio?.number_of_speakers}
            />,
            <InfoBlock
              title='Додаткові характеристики'
              info={product?.inside?.audio?.additional_features}
            />,
          ]}
        />

        <CharacteristicsItem
          title='Батарея'
          info={[
            <InfoBlock title='Тип батареї' info={product?.inside?.battery?.type} />,
            <InfoBlock title='Ємність' info={product?.inside?.battery?.['capacity_(mah)']} />,
            <InfoBlock title='Час роботи' info={product?.inside?.battery?.life} />,
          ]}
        />

        <CharacteristicsItem
          title='Програмне забезпечення'
          info={[
            <InfoBlock
              title='Операційна система'
              info={product?.inside?.software?.operating_system_version}
            />,
            <InfoBlock
              title='Версія розрядності'
              info={product?.inside?.software?.operating_system_bit_version}
            />,
          ]}
        />

        <CharacteristicsItem
          title='Підключення'
          info={[
            <InfoBlock
              title='Блютуз'
              info={`${product?.inside?.wireless?.additional_features} ${product?.inside?.wireless?.bluetooth_version}`}
            />,
            <InfoBlock
              title='WiFi'
              info={product?.inside?.wireless?.wifi_standards?.split(',')?.join(', ')}
            />,
            <InfoBlock title='Ehernet' info={product?.inside?.wired?.additional_features} />,
            <InfoBlock title='Ehernet швидкість' info={product?.inside?.wired?.ethernet_speed} />,
          ]}
        />
      </div>
    </div>
  );
};

const MainBlock = ({ product }: { product: IProductDetail }) => {
  const dispatch = useAppDispatch();
  const [inWishlist, setInWishlist] = React.useState<boolean>(false);
  const [isShowModal, setShowModal] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const { userHistory, currentDetailProduct, currentProductToCart } = useAppSelector(
    (state) => state.products,
  );
  const [mustAuthModal, setMustAuthModal] = React.useState(false);
  const itemCart = useAppSelector(selectCartItemById(currentDetailProduct?.product?.id ?? ''));

  useEffect(() => {
    if (userHistory?.wishlist) {
      const inWIshList = userHistory?.wishlist.some(
        (item) => item.product.id === currentDetailProduct?.product?.id,
      );
      setInWishlist(inWIshList);
    } else {
      setInWishlist(false);
    }
  }, [userHistory]);

  const handleAddProductToCart = (product: IProductCartItem) => {
    dispatch(productsActions.addToCart(product));
    dispatch(productsActions.setCurrentProductToCart(product));
    setShowModal(true);
    toast.success('Товар додано до кошику');
  };

  const addToCart = async () => {
    const item = {
      product: currentDetailProduct?.product,
      image: currentDetailProduct?.image,
      count: 1,
    } as IProductCartItem;

    handleAddProductToCart(item);
  };

  const removeFromCart = async () => {
    if (window.confirm('Ви впевнені, що хочете видалити цей товар з кошика?')) {
      dispatch(productsActions.removeFromCart(currentDetailProduct?.product?.id ?? ''));
      toast.info('Товар видалено з кошика');
    }
  };

  const handleAddProductToWishlist = (product: IProductItem) => {
    if (user) {
      handleAddToWishList(product, userHistory, user, dispatch);
    } else {
      setMustAuthModal(true);
    }
  };

  return (
    <>
      <div className='flex items-center gap-2 flex-wrap md:flex-nowrap'>
        <div className='w-full mb-8 md:w-1/2 md:mb-0'>
          <div className='flex justify-center items-center relative mb-2 sm:mb-6 lg:mb-10 lg:h-2/4'>
            <Image
              width={window.innerWidth < 640 ? 250 : 500}
              height={window.innerWidth < 640 ? 250 : 500}
              src={currentDetailProduct?.image?.large ?? ''}
              alt='product'
              className='object-contain sm:w-full lg:h-full'
            />
          </div>
        </div>
        <div className='w-full px-4 md:w-1/2'>
          <div className='lg:pl-20'>
            <div className='mb-8'>
              <h2 className='max-w-xl mb-2 sm:mb-6 text-2xl font-bold dark:text-gray-400 md:text-4xl'>
                {product?.product.model}
              </h2>
              <p className='inline-block mb-2 sm:mb-6 text-xl sm:text-4xl font-bold text-gray-700 dark:text-gray-400'>
                <span>{currentDetailProduct?.product?.price}₴</span>
              </p>
              <div>
                <div>Номер: {product?.product.id}</div>
                <div>Категорія: {product?.product.category}</div>
                <div>Бренд: {product?.product.brand}</div>
                <div>Сім'я: {product?.product.family}</div>
                <div>Серія: {product?.product.series}</div>
                <div>Версія: {product?.product.alias}</div>

                <div>Дата випуску: {product?.key_aspects.release_date}</div>
                <div>Батарея: {product?.key_aspects.battery}</div>
                <div>Процесор: {product?.key_aspects.processor}</div>
                <div>Відеокарта: {product?.key_aspects.integrated_graphics_card}</div>
                <div>Оперативна пам'ять: {product?.key_aspects.ram} </div>
                <div>Жорсткий диск: {product?.key_aspects.storage} </div>
              </div>
            </div>
            <div className='w-full flex items-center gap-2'>
              {itemCart ? (
                <Button className='w-full' onClick={removeFromCart} large danger>
                  <div className='w-full text-center flex items-center justify-center gap-2'>
                    <TrashIcon className='w-6 h-6' />
                    <div>Видалити з корзини</div>
                  </div>
                </Button>
              ) : (
                <Button className='w-full' primary onClick={addToCart} large>
                  <div className='w-full text-center flex items-center justify-center gap-2'>
                    <ShoppingCartIcon className='w-6 h-6' />В кошик
                  </div>
                </Button>
              )}

              {inWishlist ? (
                <Button
                  className='w-full bg-green-600 hover:bg-green-700 text-white'
                  onClick={() =>
                    currentDetailProduct && handleAddProductToWishlist(currentDetailProduct)
                  }
                  large
                  primary>
                  <div className='flex items-center justify-center gap-1'>
                    <HeartIcon className='w-6 h-6' />
                    <div>В обраному</div>
                  </div>
                </Button>
              ) : (
                <Button
                  className='w-full'
                  secondary
                  onClick={() =>
                    currentDetailProduct && handleAddProductToWishlist(currentDetailProduct)
                  }
                  large>
                  <div className='w-full text-center flex items-center justify-center gap-2'>
                    <HeartIcon className='w-6 h-6' />В обране
                  </div>
                </Button>
              )}
            </div>
          </div>
        </div>

        {currentProductToCart && (
          <AddedProductModal
            handleAddToWishList={(product: IProductItem) => {
              if (user) {
                handleAddToWishList(product, userHistory, user, dispatch);
              } else {
                toast.error('Будь ласка, увійдіть до свого облікового запису для продовження');
              }
            }}
            item={currentProductToCart}
            isOpen={isShowModal}
            setOpenModal={setShowModal}
          />
        )}
      </div>

      <MustAuthModal isOpen={mustAuthModal} onClose={() => setMustAuthModal(false)} />
    </>
  );
};

const tabs = [
  { id: 1, title: 'Все про товар' },
  { id: 2, title: 'Характеристики' },
];

const techspecsKey = process.env.NEXT_PUBLIC_TECHSPECSAPI_API_KEY;
const algoliaApplicationId = process.env.NEXT_PUBLIC_APPLICATION_ID as string;
const algoliaSearchApiKey = process.env.NEXT_PUBLIC_SEARCH_API_KEY as string;

const client = algoliasearch(algoliaApplicationId, algoliaSearchApiKey);
const index = client.initIndex('product_search');

const LaptopDetail = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const [productDetail, setProductDetail] = React.useState<IProductDetail | null>(null);
  const [productDB, setProductDB] = React.useState<any | null>(null);

  const fetchProductDB = () => {
    index.getObject(params.id).then((response: any) => {
      const product = {
        product: response.product,
        image: response.image,
      };

      dispatch(productsActions.setCurrentDetailProduct(product));
      setProductDB(response);
    });
  };

  const fetchProductDetail = async () => {
    try {
      const options = {
        method: 'GET',
        url: 'https://api.techspecs.io/v4/product/detail',
        params: { productId: params.id },
        headers: {
          accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          Authorization: techspecsKey,
        },
      };

      const response = await axios.request(options);

      setProductDetail(response.data.data.items[0]);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };
  const router = useRouter();

  const redirectToPreviousPage = () => {
    dispatch(productsActions.setCurrentDetailProduct(null));
    router.back();
  };

  useEffect(() => {
    fetchProductDB();

    fetchProductDetail();
  }, []);

  return (
    <section className='w-full max-w-[1536px] mx-auto overflow-hidden p-2 sm:p-10 flex flex-col gap-2 md:gap-5 bg-white'>
      <button
        onClick={redirectToPreviousPage}
        className='flex items-center gap-2 hover:text-colorMain'>
        <ArrowLeftIcon className='w-4 h-4 sm:w-6 sm:h-6' />
        <h2 className='sm:text-xl font-semibold'>Назад</h2>
      </button>

      {productDetail && productDB ? (
        <div>
          <Tab.Group>
            <Tab.List className='w-full flex rounded-xl bg-blue-900/20 p-1'>
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  className={({ selected }) =>
                    cx(
                      'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                      'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-blue-700 shadow'
                        : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
                    )
                  }>
                  {tab.title}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className='mt-2'>
              {tabs.map((tab) => (
                <Tab.Panel key={tab.id} className={'rounded-xl bg-white py-2 md:py-7'}>
                  {tab.id === 1 ? (
                    <MainBlock product={productDetail} />
                  ) : (
                    <CharacteristicsBlock product={productDetail} />
                  )}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      ) : (
        <Loader />
      )}
    </section>
  );
};

export default LaptopDetail;
