'use client';

import { Tab } from '@headlessui/react';
import axios from 'axios';
import Image from 'next/image';
import React, { ReactNode, useEffect, useState } from 'react';
import cx from 'clsx';
import Button from '@src/ui/Button';
import { CheckIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import { selectCartItemById } from '@src/redux/reducers/Products/selectors';
import { IProductCartItem, IProductItem } from '@src/redux/models';
import { productsActions } from '@src/redux/reducers/Products/products';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '@src/firebaseConfig';
import { handleAddToWishList } from '@src/api/products';
import AddedProductModal from '@src/components/AddedProductModal';

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
  camera: {
    front_camera: {
      definition: string;
      'resolution_(h_x_w)': string;
      additional_features: string;
    };
  };
  inside: {
    cpu: {
      number_of_cores: string;
      brand: string;
      model: string;
      generation: string;
      family: string;
      cache: string;
      'configurable_tdp_(thermal_design_power)_up': string;
      'configurable_tdp_(thermal_design_power)_up_frequency': string;
    };
    ram: {
      capacity: string;
      maximum_capacity: string;
      type: string;
      clock_speed: string;
      form_factor: string;
    };
    gpu: {
      integrated_card_model: string;
      additional_features: string;
    };
    storage: {
      total_capacity: string;
    };
    ssd: {
      capacity: string;
      total_ssd_capacity: string;
      number_of_ssds: string;
      storage_type: string;
      ssd_interface: string;
    };
    battery: {
      'capacity_(mah)': string;
      life: string;
      number_of_cells: string;
      type: string;
    };
    power: {
      power: string;
    };
    wireless: {
      wifi_standards: string;
      bluetooth_version: string;
      additional_features: string;
    };
    wired: {
      ethernet_speed: string;
      additional_features: string;
    };
    audio: {
      number_of_speakers: string;
      additional_features: string;
    };
    software: {
      operating_system_version: string;
      operating_system_bit_version: string;
    };
    ports: {
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

const data: IProductDetail = {
  product: {
    dedupe: 'Acer Extensa 15 EX215-54-51WY NX.EGJET.03C',
    is_translated: true,
    alias: 'EX215-54-51WY',
    part_number: 'NX.EGJET.03C',
    brand: 'Acer',
    family: 'Extensa',
    series: '15',
    version: 'NX.EGJET.03C',
    model: 'Acer Extensa 15 EX215-54-51WY',
    category: 'Laptops',
    'ean/upc_code': '4711121250378',
    id: '6597e4197badaa68d28cf8e8',
  },
  date: {
    released: '2022-09-04',
  },
  image: {
    thumbnail:
      'https://i.techspecs.io/product-images-thumbnail/laptops/df6b1c79-1c78-4c8f-81a5-429911a3196b.jpeg',
    large:
      'https://i.techspecs.io/product-images-large/laptops/2a1198f1-e70b-4cf9-87c9-16255045f3e1.jpeg',
  },
  key_aspects: {
    release_date: '2022-09-04',
    ram: '8 GB',
    storage: '256 GB',
    processor: 'i5-1135G7',
    integrated_graphics_card: 'Intel Iris Xe Graphics',
    battery: '36 Wh',
  },
  design: {
    body: {
      type: 'Laptop',
      style: 'Clamshell',
      colors: 'Black',
      'width_(longer_side)': '363.4 mm',
      weight: '1.7 kg',
      'height_(shorter_side)': '238.4 mm',
      thickness: '19.9 mm',
    },
    keyboard: {
      additional_features: 'Numeric Keypad',
    },
    touchpad: {
      pointing_device: 'Touchpad',
    },
    security: {
      lock_slot_type: 'Kensington',
      additional_features: 'Lock Slot',
    },
  },
  display: {
    type: 'IPS',
    definition: 'Full HD',
    diagonal: '15.6 inch',
    'resolution_(h_x_w)': '1920 x 1080 pixels',
    aspect_ratio: '16:9',
    refresh_rate: '60 Hz',
    additional_features: 'LED Backlight',
  },
  camera: {
    front_camera: {
      definition: 'HD',
      'resolution_(h_x_w)': '1280 x 720 pixels',
      additional_features: 'Camera Module',
    },
  },
  inside: {
    cpu: {
      number_of_cores: '4',
      brand: 'Intel',
      model: 'i5-1135G7',
      generation: '11th gen Intel Core i5',
      family: 'Intel Core i5',
      cache: '8 MB',
      'configurable_tdp_(thermal_design_power)_up': '28 W',
      'configurable_tdp_(thermal_design_power)_up_frequency': '2.4 GHz',
    },
    ram: {
      capacity: '8 GB',
      maximum_capacity: '8 GB',
      type: 'DDR4-SDRAM',
      clock_speed: '2666 MHz',
      form_factor: 'On-board',
    },
    gpu: {
      integrated_card_model: 'Intel Iris Xe Graphics',
      additional_features: 'Integrated Graphics Card',
    },
    storage: {
      total_capacity: '256 GB',
    },
    ssd: {
      capacity: '256 GB',
      total_ssd_capacity: '256 GB',
      number_of_ssds: '1',
      storage_type: 'SSD',
      ssd_interface: 'PCI Express',
    },
    battery: {
      'capacity_(mah)': '36 Wh',
      life: '8 h',
      number_of_cells: '2',
      type: 'Lithium-Ion (Li-Ion)',
    },
    power: {
      power: '45 W',
    },
    wireless: {
      wifi_standards: '802.11a, 802.11b, 802.11g, Wi-Fi 4 (802.11n), Wi-Fi 5 (802.11ac)',
      bluetooth_version: '5.0',
      additional_features: 'Bluetooth Module',
    },
    wired: {
      ethernet_speed: '10, 100, 1000 Mbit/s',
      additional_features: 'Ethernet Card',
    },
    audio: {
      number_of_speakers: '2',
      additional_features: 'Headphone Microphone Combo Jack, Microphone',
    },
    software: {
      operating_system_version: 'Windows 11 Pro',
      operating_system_bit_version: '64-bit',
    },
    ports: {
      'number_of_usb_3,2_gen_1_type_a_ports': '2',
      number_of_hdmi_ports: '1',
      'number_of_usb_2,0_ports': '1',
      'number_of_ethernet_lan_(rj-45)_ports': '1',
      charging: 'DC-in jack',
    },
  },
  no: {
    touchscreen: 'Touchscreen',
    dedicated_card: 'Dedicated Graphics Card',
  },
  No: {
    Touchscreen: 'Touchscreen',
    Dedicated_Card: 'Dedicated Graphics Card',
  },
};

const InfoBlock = ({ title, info }: { title: string; info: string }) => {
  return (
    <div className='flex items-end justify-between'>
      {title}
      <div className='border-b-2 border-dashed flex-1'></div>
      {info}
    </div>
  );
};

const CharacteristicsItem = ({ title, info }: { title: string; info: ReactNode[] }) => {
  return (
    <div className='flex flex-col gap-1'>
      <h2 className='text-xl font-medium'>{title}</h2>
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
      <h2 className='text-2xl font-semibold'>Характеристики {product?.product.model}</h2>

      <div className='flex flex-col gap-5'>
        <CharacteristicsItem
          title='Екран'
          info={[
            <InfoBlock title='Діагональ екрану' info={product?.display.diagonal} />,
            <InfoBlock
              title='Роздільна здатність екрану'
              info={`${product?.display['resolution_(h_x_w)']} ${product?.display.definition}`}
            />,
            <InfoBlock title='Частота оновлення екрану' info={product?.display.refresh_rate} />,
            <InfoBlock title='Тип матриці' info={product?.display.type} />,
          ]}
        />

        <CharacteristicsItem
          title='Корпус'
          info={[
            <InfoBlock title='Ширина' info={product.design.body['width_(longer_side)']} />,
            <InfoBlock title='Висота' info={product.design.body['height_(shorter_side)']} />,
            <InfoBlock title='Товщина' info={product.design.body.thickness} />,
            <InfoBlock title='Вага' info={product.design.body.weight} />,
          ]}
        />

        <CharacteristicsItem
          title='Камера'
          info={[
            <InfoBlock
              title='Особливості'
              info={product.camera.front_camera.additional_features}
            />,
            <InfoBlock
              title='Роздільна здатність'
              info={`${product.camera.front_camera.definition} ${product.camera.front_camera['resolution_(h_x_w)']}`}
            />,
          ]}
        />

        <CharacteristicsItem
          title='Відеокарта'
          info={[
            <InfoBlock title='Модель' info={product.inside.gpu.integrated_card_model} />,
            <InfoBlock title='Особливості' info={product?.inside.gpu.additional_features} />,
          ]}
        />

        <CharacteristicsItem
          title='Процесор'
          info={[
            <InfoBlock
              title='Процесор'
              info={`${product?.inside.cpu.family} ${product.inside.cpu.model}`}
            />,
            <InfoBlock title='Покоління' info={product.inside.cpu.generation} />,
            <InfoBlock title='Кількість ядер' info={product.inside.cpu.number_of_cores} />,
          ]}
        />

        <CharacteristicsItem
          title="Оперативна пам'ять"
          info={[
            <InfoBlock title="Обсяг оперативної пам'яті" info={product.inside.ram.capacity} />,
            <InfoBlock title="Тип оперативної пам'яті" info={product.inside.ram.type} />,
            <InfoBlock
              title="Характеристики оперативної пам'яті"
              info={product.inside.ram.clock_speed}
            />,
          ]}
        />

        <CharacteristicsItem
          title='Жорсткий диск'
          info={[
            <InfoBlock title='Тип накопичувача' info={product.inside.ssd.storage_type} />,
            <InfoBlock title='Кількість накопичувачів' info={product.inside.ssd.number_of_ssds} />,
            <InfoBlock title="Об'єм накопичувача" info={product.inside.ssd.total_ssd_capacity} />,
          ]}
        />

        <CharacteristicsItem
          title='Аудіо'
          info={[
            <InfoBlock
              title='Кількість динаміків'
              info={product.inside.audio.number_of_speakers}
            />,
            <InfoBlock
              title='Додаткові характеристики'
              info={product.inside.audio.number_of_speakers}
            />,
          ]}
        />

        <CharacteristicsItem
          title='Батарея'
          info={[
            <InfoBlock title='Тип батареї' info={product.inside.battery.type} />,
            <InfoBlock title='Ємність' info={product.inside.battery['capacity_(mah)']} />,
            <InfoBlock title='Час роботи' info={product.inside.battery.life} />,
          ]}
        />

        <CharacteristicsItem
          title='Програмне забезпечення'
          info={[
            <InfoBlock
              title='Операційна система'
              info={product.inside.software.operating_system_version}
            />,
            <InfoBlock
              title='Версія розрядності'
              info={product.inside.software.operating_system_bit_version}
            />,
          ]}
        />

        <CharacteristicsItem
          title='Підключення'
          info={[
            <InfoBlock
              title='Блютуз'
              info={`${product.inside.wireless.additional_features} ${product.inside.wireless.bluetooth_version}`}
            />,
            <InfoBlock
              title='WiFi'
              info={product.inside.wireless.wifi_standards.split(',').join(', ')}
            />,
            <InfoBlock title='Ehernet' info={product.inside.wired.additional_features} />,
            <InfoBlock title='Ehernet швидкість' info={product.inside.wired.ethernet_speed} />,
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
  const itemCart = useAppSelector(selectCartItemById(product.product.id));

  useEffect(() => {
    if (userHistory?.wishlist) {
      const inWIshList = userHistory?.wishlist.some(
        (item) => product.product.id === item.product.id,
      );
      setInWishlist(inWIshList);
    }
  }, [userHistory]);

  console.log(currentDetailProduct);

  const handleAddProductToCart = (product: IProductCartItem) => {
    dispatch(productsActions.addToCart(product));
    dispatch(productsActions.setCurrentProductToCart(product));
    setShowModal(true);
  };

  const addToCart = async () => {
    const item = {
      product: currentDetailProduct?.product,
      image: currentDetailProduct?.image,
      count: 1,
    } as IProductCartItem;

    handleAddProductToCart(item);
  };

  return (
    <div className='flex flex-wrap -mx-4'>
      <div className='w-full mb-8 md:w-1/2 md:mb-0'>
        <div className='sticky top-0 z-10 overflow-hidden '>
          <div className='relative mb-6 lg:mb-10 lg:h-2/4'>
            <Image
              width={500}
              height={500}
              src={product?.image.large}
              alt='product'
              className='object-cover w-full lg:h-full'
            />
          </div>
        </div>
      </div>
      <div className='w-full px-4 md:w-1/2'>
        <div className='lg:pl-20'>
          <div className='mb-8'>
            <h2 className='max-w-xl mb-6 text-2xl font-bold dark:text-gray-400 md:text-4xl'>
              {product?.product.model}
            </h2>
            <p className='inline-block mb-6 text-4xl font-bold text-gray-700 dark:text-gray-400'>
              <span>{currentDetailProduct?.product.price}₴</span>
            </p>
            <div>
              <div>Номер: {product?.product.id}</div>
              <div>Категорія: {product?.product.category}</div>
              <div>Бренд: {product?.product.brand}</div>
              <div>Сім'я: {product?.product.family}</div>
              <div>Серія: {product?.product.series}</div>
              <div>Версія: {product?.product.alias}</div>

              <div>Дата випуску: {product.key_aspects.release_date}</div>
              <div>Батарея: {product.key_aspects.battery}</div>
              <div>Процесор: {product.key_aspects.processor}</div>
              <div>Відеокарта: {product.key_aspects.integrated_graphics_card}</div>
              <div>Оперативна пам'ять: {product.key_aspects.ram} </div>
              <div>Жорсткий диск: {product.key_aspects.storage} </div>
            </div>
          </div>
          {!!itemCart ? (
            <Button
              primary
              className='w-full bg-green-600 hover:bg-green-700 rounded-md border border-transparent px-5 py-2.5 text-sm font-medium text-white'>
              <div className='w-full text-center flex items-center justify-center gap-2'>
                <CheckIcon className='w-6 h-6' />
                In the cart
              </div>
            </Button>
          ) : (
            <div className='w-full flex items-center gap-2'>
              <Button className='w-full' primary onClick={addToCart} large>
                <div className='w-full text-center flex items-center justify-center gap-2'>
                  <ShoppingCartIcon className='w-6 h-6' />
                  Add to cart
                </div>
              </Button>

              {inWishlist ? (
                <Button
                  className='w-full bg-green-600 hover:bg-green-700 text-white'
                  onClick={addToCart}
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
                    handleAddToWishList(currentDetailProduct, userHistory, user, dispatch)
                  }
                  large>
                  <div className='w-full text-center flex items-center justify-center gap-2'>
                    <HeartIcon className='w-6 h-6' />
                    Add to wishlist
                  </div>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {currentProductToCart && (
        <AddedProductModal
          handleAddToWishList={(product: IProductItem) =>
            handleAddToWishList(product, userHistory, user, dispatch)
          }
          item={currentProductToCart}
          isOpen={isShowModal}
          setOpenModal={setShowModal}
        />
      )}
    </div>
  );
};

const tabs = [
  { id: 1, title: 'Все про товар' },
  { id: 2, title: 'Характеристики' },
];

const LaptopDetail: React.FC = ({ params }) => {
  const [product, setProduct] = React.useState<IProductDetail | null>(data);

  const fetchProductDetail = async () => {
    try {
      const options = {
        method: 'GET',
        url: 'https://api.techspecs.io/v4/product/detail',
        params: { productId: params.id },
        headers: {
          accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImN1c19QNFdkVlRaSDBiMGt0QiIsIm1vZXNpZlByaWNpbmdJZCI6InByaWNlXzFNUXF5dkJESWxQbVVQcE1NNWc2RmVvbyIsImlhdCI6MTcwMDkyNTM1M30.DW0phvKsBPzP03y8PICvYQVzKC2OwW-k8dHNAz8NEgQ',
        },
      };

      const response = await axios.request(options);

      console.log(response.data);

      // setProductDetail();
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  useEffect(() => {
    // fetchProductDetail();
  }, []);

  console.log(product);

  return (
    <section className='overflow-hidden p-10 bg-white'>
      <div className=''>
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
              <Tab.Panel key={tab.id} className={'rounded-xl bg-white py-7'}>
                {tab.id === 1 ? (
                  <MainBlock product={product} />
                ) : (
                  <CharacteristicsBlock product={product} />
                )}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  );
};

export default LaptopDetail;
