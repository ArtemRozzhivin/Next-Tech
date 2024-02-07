'use client';

import axios from 'axios';
import Image from 'next/image';
import React, { useEffect } from 'react';

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

const InfoBlock = ({ title, info }) => {
  return (
    <div className='flex items-end justify-between'>
      {title}
      <div className='border-b-2 border-dashed flex-1'></div>
      {info}
    </div>
  );
};

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
    <section className='overflow-hidden bg-white py-11 font-poppins dark:bg-gray-800'>
      <div className='max-w-6xl px-4 py-4 mx-auto lg:py-8 md:px-6'>
        <div className='flex flex-wrap -mx-4'>
          <div className='w-full mb-8 md:w-1/2 md:mb-0'>
            <div className='sticky top-0 z-50 overflow-hidden '>
              <div className='relative mb-6 lg:mb-10 lg:h-2/4'>
                <Image
                  width={500}
                  height={500}
                  src={product?.image.large}
                  alt='product'
                  className='object-cover w-full lg:h-full'
                />
              </div>
              {/* <div className='flex flex-wrap hidden md:flex'>
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className='w-1/2 p-2 sm:w-1/4'>
                    <a href='#' className='block border border-blue-300 hover:border-blue-300'>
                      <img
                        src='https://i.postimg.cc/6qcPhTQg/R-18.png'
                        alt={`Product ${index}`}
                        className='object-cover w-full lg:h-20'
                      />
                    </a>
                  </div>
                ))}
              </div>
              <div className='px-6 pb-6 mt-6 border-t border-gray-300 dark:border-gray-400'>
                <div className='flex flex-wrap items-center mt-6'>
                  <span className='mr-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='16'
                      height='16'
                      fill='currentColor'
                      className='w-4 h-4 text-gray-700 dark:text-gray-400 bi bi-truck'
                      viewBox='0 0 16 16'>
                      <path d='M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z' />
                    </svg>
                  </span>
                  <h2 className='text-lg font-bold text-gray-700 dark:text-gray-400'>
                    Free Shipping
                  </h2>
                </div>
                <div className='mt-2 px-7'>
                  <a className='text-sm text-blue-400 dark:text-blue-200' href='#'>
                    Get delivery dates
                  </a>
                </div>
              </div> */}
            </div>
          </div>
          <div className='w-full px-4 md:w-1/2'>
            <div className='lg:pl-20'>
              <div className='mb-8'>
                <h2 className='max-w-xl mb-6 text-2xl font-bold dark:text-gray-400 md:text-4xl'>
                  {product?.product.model}
                </h2>
                <p className='inline-block mb-6 text-4xl font-bold text-gray-700 dark:text-gray-400'>
                  <span>$1500.99</span>
                  {/* <span className='text-base font-normal text-gray-500 line-through dark:text-gray-400'>
                    $1800.99
                  </span> */}
                </p>
                <p className='max-w-md text-gray-700 dark:text-gray-400'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in ex augue.
                  Curabitur eu nisl at risus consequat pharetra.
                </p>
              </div>
              <div className='flex flex-wrap items-center gap-4'>
                <button className='w-full p-4 bg-blue-500 rounded-md lg:w-2/5 dark:text-gray-200 text-gray-50 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-700'>
                  Add to cart
                </button>
                <button className='flex items-center justify-center w-full p-4 text-blue-500 border border-blue-500 rounded-md lg:w-2/5 dark:text-gray-200 dark:border-blue-600 hover:bg-blue-600 hover:border-blue-600 hover:text-gray-100 dark:bg-blue-500 dark:hover:bg-blue-700 dark:hover:border-blue-700 dark:hover:text-gray-300'>
                  Buy Now
                </button>
              </div>

              <div>
                <div>Номер: {product?.product.id}</div>
                <div>Категорія: {product?.product.category}</div>
                <div>Бренд: {product?.product.brand}</div>
                <div>Сім'я: {product?.product.family}</div>
                <div>Серія: {product?.product.series}</div>
                <div>Версія: {product?.product.alias}</div>
              </div>

              <div>
                <h2>Характеристики {product?.product.model}</h2>
                <InfoBlock title='Діагональ екрану' info={product?.display.diagonal} />
                <InfoBlock
                  title='Роздільна здатність екрану'
                  info={`${product?.display['resolution_(h_x_w)']} ${product?.display.definition}`}
                />
                <InfoBlock title='Частота оновлення екрану' info={product?.display.refresh_rate} />
                <InfoBlock title='Тип матриці' info={product?.display.type} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaptopDetail;
