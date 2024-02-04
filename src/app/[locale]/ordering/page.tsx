'use client';

import React, { Fragment } from 'react';
import { ArrowLeftIcon, ArrowLongLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import ProductCartItem from '@src/components/ProductCartItem';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import { Link, useRouter } from '@src/navigation';
import Button from '@src/ui/Button';
import { IUserHistory, productsActions } from '@src/redux/reducers/Products/products';
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@src/firebaseConfig';
import { getUserHistory } from '@src/api/user';
import routes from '@src/routes';
import ProductOrderingItem from '@src/components/ProductOrderingItem';
import Input from '@src/ui/Input';
import Image from 'next/image';
import Select from 'react-select';
import novaPoshta from '@src/assets/novaPoshta.svg';
import comfy from '@src/assets/comfy.svg';
import cx from 'clsx';
import { Dialog, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Modal from '@src/ui/Modal';
import axios from 'axios';
import { useDebounce, useDebouncedCallback } from 'use-debounce';
import InputSelect from '@src/ui/InputSelect';

interface ICity {
  AddressDeliveryAllowed: boolean;
  Area: string;
  DeliveryCity: string;
  MainDescription: string;
  ParentRegionCode: string;
  ParentRegionTypes: string;
  Present: string;
  Ref: string;
  Region: string;
  RegionTypes: string;
  RegionTypesCode: string;
  SettlementTypeCode: string;
  StreetsAvailability: boolean;
  Warehouses: number;
}

interface IAdress {
  Location: { lat: number; lon: number };
  Present: string;
  SettlementRef: string;
  SettlementStreetDescription: string;
  SettlementStreetDescriptionRu: string;
  SettlementStreetRef: string;
  StreetsType: string;
  StreetsTypeDescription: string;
}

interface IOfficeAddress {
  SiteKey: string;
  Description: string;
  DescriptionRu: string;
  ShortAddress: string;
  ShortAddressRu: string;
  Phone: string;
  TypeOfWarehouse: string;
  Ref: string;
  Number: string;
  CityRef: string;
  CityDescription: string;
  CityDescriptionRu: string;
  SettlementRef: string;
  SettlementDescription: string;
  SettlementAreaDescription: string;
  SettlementRegionsDescription: string;
  SettlementTypeDescription: string;
  SettlementTypeDescriptionRu: string;
  Longitude: string;
  Latitude: string;
  PostFinance: string;
  BicycleParking: string;
  PaymentAccess: string;
  POSTerminal: string;
  InternationalShipping: string;
  SelfServiceWorkplacesCount: string;
  TotalMaxWeightAllowed: string;
  PlaceMaxWeightAllowed: string;
  SendingLimitationsOnDimensions: {
    Width: number;
    Height: number;
    Length: number;
  };
  ReceivingLimitationsOnDimensions: {
    Width: number;
    Height: number;
    Length: number;
  };
  Reception: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  Delivery: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  Schedule: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  DistrictCode: string;
  WarehouseStatus: string;
  WarehouseStatusDate: string;
  WarehouseIllusha: string;
  CategoryOfWarehouse: string;
  Direct: string;
  RegionCity: string;
  WarehouseForAgent: string;
  GeneratorEnabled: string;
  MaxDeclaredCost: string;
  WorkInMobileAwis: string;
  DenyToSelect: string;
  CanGetMoneyTransfer: string;
  HasMirror: string;
  HasFittingRoom: string;
  OnlyReceivingParcel: string;
  PostMachineType: string;
  PostalCodeUA: string;
  WarehouseIndex: string;
  BeaconCode: string;
}

export const Ordering = () => {
  let timeoutId: NodeJS.Timeout | null = null;
  const { cartProducts, cartProductsCount, cartProductsTotalPrice } = useAppSelector(
    (state) => state.products,
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [currentDelivery, setCurrentDelivery] = React.useState<string | null>(null);

  const [isSearchCityOpen, setIsSearchCityOpen] = React.useState<boolean>(false);
  const [searchCity, setSearchCity] = React.useState<string>('');
  const [allCities, setAllCities] = React.useState<ICity[]>([]);
  const [city, setCity] = React.useState<ICity | null>(null);

  const [isSearchAdressOpen, setIsSearchAdressOpen] = React.useState<boolean>(false);
  const [allAdresses, setAllAdresses] = React.useState<IAdress[]>([]);
  const [searchAdress, setSearchAdress] = React.useState<string>('');
  const [address, setAddress] = React.useState<null | IAdress>(null);

  const [isSearchOfficeAddressOpen, setIsSearchOfficeAddressOpen] = React.useState<boolean>(false);
  const [allOfficeAddress, setAllOfficeAddress] = React.useState<IOfficeAddress[]>([]);
  const [searchOfficeAddress, setSearchOfficeAddress] = React.useState<string>('');
  const [officeAddress, setOfficeAddress] = React.useState<null | IOfficeAddress>(null);

  const [house, setHouse] = React.useState<string>('');
  const [flat, setFlat] = React.useState<string>('');

  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [patronymic, setPatronymic] = React.useState<string>('');

  const handleDelivery = (id: string) => {
    setCurrentDelivery(id);
  };

  const fetchCities = async (value: string) => {
    const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      apiKey: 'd2525e4f0272ebd8bcf60e2b8d77820e',
      modelName: 'Address',
      calledMethod: 'searchSettlements',
      methodProperties: {
        CityName: value,
        Limit: '50',
        Page: '1',
      },
    });

    setAllCities(response.data.data[0].Addresses);
  };

  const fetchAdress = async (value: string) => {
    const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      apiKey: 'd2525e4f0272ebd8bcf60e2b8d77820e',
      modelName: 'Address',
      calledMethod: 'searchSettlementStreets',
      methodProperties: {
        StreetName: value,
        SettlementRef: city.Ref,
      },
    });

    setAllAdresses(response.data.data[0].Addresses);
  };

  const fetchOffieceNumber = async (value: string) => {
    const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      apiKey: 'd2525e4f0272ebd8bcf60e2b8d77820e',
      modelName: 'Address',
      calledMethod: 'getWarehouses',
      methodProperties: {
        CityRef: city?.DeliveryCity,
        FindByString: value,
      },
    });

    setAllOfficeAddress(response.data.data);
  };

  console.log(city);

  const debouncedCallback = useDebouncedCallback((callback) => {
    callback();
  }, 1500);

  const handleCityInput = (e: any) => {
    setSearchCity(e.target.value);

    debouncedCallback(() => fetchCities(e.target.value));
  };

  const handleCityClick = (value: ICity) => {
    setCity(value);
    setIsSearchCityOpen(false);
  };

  const handleAdressInput = (e: any) => {
    setSearchAdress(e.target.value);

    debouncedCallback(() => fetchAdress(e.target.value));
  };

  const handleOfficeAdressInput = (e: any) => {
    setSearchOfficeAddress(e.target.value);

    debouncedCallback(() => fetchOffieceNumber(e.target.value));
  };

  const handleAdressClick = (value: IAdress) => {
    setIsSearchAdressOpen(false);
    setAddress(value);
    setSearchAdress(value.Present);
  };

  const handleOfficeAdressClick = (value: IOfficeAddress) => {
    setOfficeAddress(value);
    setSearchOfficeAddress(value.Description);
    setIsSearchOfficeAddressOpen(false);
  };

  const redirectToPreviousPage = () => {
    router.back();
  };

  console.log(allOfficeAddress, 'allOfficeAddress');

  const clearCart = () => {
    if (window.confirm('Ви впевнені, що хочете очистити кошик?')) {
      dispatch(productsActions.clearCart());
    }
  };

  const buyProducts = async () => {
    if (user) {
      try {
        const productRef = doc(db, 'users', user.uid);

        await updateDoc(productRef, {
          purchases: arrayUnion(...cartProducts),
        });
      } catch (error) {
        console.log(error);
      }
    }
    dispatch(productsActions.clearCart());

    getUserHistory(user).then((userHistory) => {
      if (userHistory) dispatch(productsActions.setUserHistory(userHistory as IUserHistory));
    });
  };

  return (
    <div className='flex flex-col gap-5 p-5'>
      <div className='flex items-start gap-3'>
        <div className='flex-1 flex flex-col gap-5'>
          <div className='flex flex-col gap-5'>
            <div className='text-2xl font-semibold'>1. Товари</div>
            <div className='flex flex-col gap-3 justify-center items-center'>
              {cartProducts.map((item) => (
                <ProductOrderingItem key={item.product.version} {...item} />
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-5'>
            <div className='text-2xl font-semibold'>2. Контактна інформація</div>
            <div className='rounded-md p-5 bg-lightmain'>
              <div className='flex items-center gap-20'>
                <Input
                  name='phone'
                  type='tel'
                  label='Номер телефону'
                  // value={}
                  placeholder='example@gmail.com'
                  // onChange={handleInput}
                />

                <Input
                  name='email'
                  type='text'
                  label='Електронна пошта'
                  // value={}
                  placeholder='example@gmail.com'
                  // onChange={handleInput}
                />
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-5'>
            <div className='text-2xl font-semibold'>3. Спосіб доставки</div>
            <div className='flex flex-col gap-5 rounded-md p-5 bg-lightmain'>
              <>
                <button
                  type='button'
                  onClick={() => setIsSearchCityOpen(true)}
                  className='flex items-center justify-between text-left rounded-md bg-black/20 p-4 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'>
                  {city !== null ? <div>{city.Present}</div> : <div>Оберіть ваше місто</div>}
                  <div>
                    <ChevronDownIcon className='w-7 h-7' />
                  </div>
                </button>

                <Modal
                  size='large'
                  isOpened={isSearchCityOpen}
                  onClose={() => setIsSearchCityOpen(false)}
                  title='Оберіть місто'
                  type='info'>
                  <div className='flex flex-col gap-5'>
                    <Input
                      label='Місто'
                      placeholder='Ваше місто'
                      value={searchCity}
                      onChange={(e) => handleCityInput(e)}
                      name='city'
                    />

                    <div className='max-h-64 overflow-auto flex flex-col gap-2'>
                      {allCities.length === 0 ? (
                        <div>No City</div>
                      ) : (
                        allCities.map((city) => (
                          <Button onClick={() => handleCityClick(city)} giant noBorder>
                            {city.Present}
                          </Button>
                        ))
                      )}
                    </div>
                  </div>
                </Modal>
              </>

              <div className='flex flex-col gap-10'>
                <div
                  onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                    handleDelivery(e.currentTarget.id)
                  }
                  id='courier-nova-poshta'
                  className='p-5 rounded-md border border-colorMain flex flex-col gap-5'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={cx(
                        'w-5 h-5 rounded-full border border-colorMain',
                        currentDelivery === 'courier-nova-poshta' && 'bg-colorMain',
                      )}></div>
                    <div className='flex items-center gap-3'>
                      <div>Кур'єр Нова пошта </div>
                      <div>
                        <Image
                          width={65}
                          height={65}
                          src={novaPoshta}
                          alt='delivery-icon'
                          className='ogg-inline-tab__media-img'
                        />
                      </div>
                    </div>
                  </div>
                  {currentDelivery === 'courier-nova-poshta' && (
                    <div className='flex flex-col gap-5'>
                      <div className='flex items-center gap-5'>
                        <Input
                          name='house'
                          type='text'
                          label='Будинок'
                          value={house}
                          placeholder='Ваш будинок'
                          onChange={(e) => setHouse(e.target.value)}
                        />
                        <Input
                          name='flat'
                          type='text'
                          label='Квартира'
                          value={flat}
                          placeholder='Ваша квартира'
                          onChange={(e) => setFlat(e.target.value)}
                        />
                      </div>

                      <div className='flex items-center gap-5'>
                        <Input
                          name='lastName'
                          type='text'
                          label='Прізвище'
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                        <Input
                          name='firstName'
                          type='text'
                          label="Ім'я"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                        <Input
                          name='email'
                          type='text'
                          label='По батькові'
                          value={patronymic}
                          onChange={(e) => setPatronymic(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleDelivery(e.currentTarget.id)
                  }
                  id='courier-comfy'
                  className='p-5 rounded-md border border-colorMain flex flex-col gap-5'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={cx(
                        'w-5 h-5 rounded-full border border-colorMain',
                        currentDelivery === 'courier-comfy' && 'bg-colorMain',
                      )}></div>
                    <div className='flex items-center gap-3'>
                      <div>Кур'єр COMFY </div>
                      <div>
                        <Image
                          width={65}
                          height={65}
                          src={comfy}
                          alt='delivery-icon'
                          className='ogg-inline-tab__media-img'
                        />
                      </div>
                    </div>
                  </div>
                  {currentDelivery === 'courier-comfy' && (
                    <div className='flex flex-col gap-5'>
                      <div>
                        <>
                          <button
                            type='button'
                            onClick={() => setIsSearchAdressOpen(true)}
                            className='flex items-center justify-between text-left rounded-md bg-black/20 p-4 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'>
                            {address !== null ? (
                              <div>{address.Present}</div>
                            ) : (
                              <div>Оберіть ваше адресу</div>
                            )}
                            <div>
                              <ChevronDownIcon className='w-7 h-7' />
                            </div>
                          </button>

                          <Modal
                            size='large'
                            isOpened={isSearchAdressOpen}
                            onClose={() => setIsSearchAdressOpen(false)}
                            title='Оберіть вашу адресу'
                            type='info'>
                            <div className='flex flex-col gap-5'>
                              <Input
                                label='Вашу адреса'
                                value={searchAdress}
                                onChange={(e) => handleAdressInput(e)}
                                name='city'
                              />

                              <div className='max-h-64 overflow-auto flex flex-col gap-2'>
                                {allAdresses.length === 0 ? (
                                  <div>No adress</div>
                                ) : (
                                  allAdresses.map((item) => (
                                    <Button onClick={() => handleAdressClick(item)} giant noBorder>
                                      {item.Present}
                                    </Button>
                                  ))
                                )}
                              </div>
                            </div>
                          </Modal>
                        </>
                      </div>
                      <div className='flex items-center gap-5'>
                        <Input
                          name='house'
                          type='text'
                          label='Будинок'
                          value={house}
                          placeholder='Ваш будинок'
                          onChange={(e) => setHouse(e.target.value)}
                        />
                        <Input
                          name='flat'
                          type='text'
                          label='Квартира'
                          value={flat}
                          placeholder='Ваша квартира'
                          onChange={(e) => setFlat(e.target.value)}
                        />
                      </div>

                      <div className='flex items-center gap-5'>
                        <Input
                          name='lastName'
                          type='text'
                          label='Прізвище'
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                        <Input
                          name='firstName'
                          type='text'
                          label="Ім'я"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                        <Input
                          name='email'
                          type='text'
                          label='По батькові'
                          value={patronymic}
                          onChange={(e) => setPatronymic(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleDelivery(e.currentTarget.id)
                  }
                  id='to-nova-poshta-office'
                  className='p-5 rounded-md border border-colorMain flex flex-col gap-5'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={cx(
                        'w-5 h-5 rounded-full border border-colorMain',
                        currentDelivery === 'to-nova-poshta-office' && 'bg-colorMain',
                      )}></div>
                    <div className='flex items-center gap-3'>
                      <div>До відділення Нової пошти</div>
                      <div>
                        <Image
                          width={65}
                          height={65}
                          src={novaPoshta}
                          alt='delivery-icon'
                          className='ogg-inline-tab__media-img'
                        />
                      </div>
                    </div>
                  </div>
                  {currentDelivery === 'to-nova-poshta-office' && (
                    <div className='flex flex-col gap-5'>
                      <div className='flex items-center gap-5'>
                        <>
                          <button
                            type='button'
                            onClick={() => setIsSearchOfficeAddressOpen(true)}
                            className='flex items-center justify-between text-left rounded-md bg-black/20 p-4 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'>
                            {officeAddress !== null ? (
                              <div>{officeAddress.Description}</div>
                            ) : (
                              <div>Оберіть номер відділення або поштомат</div>
                            )}
                            <div>
                              <ChevronDownIcon className='w-7 h-7' />
                            </div>
                          </button>

                          <Modal
                            size='large'
                            isOpened={isSearchOfficeAddressOpen}
                            onClose={() => setIsSearchOfficeAddressOpen(false)}
                            title='Оберіть номер відділення або поштомат'
                            type='info'>
                            <div className='flex flex-col gap-5'>
                              <Input
                                label='Оберіть номер відділення або поштомат'
                                value={searchOfficeAddress}
                                onChange={(e) => handleOfficeAdressInput(e)}
                                name='city'
                              />

                              <div className='max-h-64 overflow-auto flex flex-col gap-2'>
                                {allOfficeAddress.length === 0 ? (
                                  <div>No office</div>
                                ) : (
                                  allOfficeAddress.map((item) => (
                                    <Button
                                      onClick={() => handleOfficeAdressClick(item)}
                                      giant
                                      noBorder>
                                      {item.Description}
                                    </Button>
                                  ))
                                )}
                              </div>
                            </div>
                          </Modal>
                        </>
                      </div>

                      <div className='flex items-center gap-5'>
                        <Input
                          name='lastName'
                          type='text'
                          label='Прізвище'
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                        <Input
                          name='firstName'
                          type='text'
                          label="Ім'я"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                        <Input
                          name='email'
                          type='text'
                          label='По батькові'
                          value={patronymic}
                          onChange={(e) => setPatronymic(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='rounded-md flex flex-col gap-10 bg-lightmain p-5'>
          <div className='flex flex-col gap-3'>
            <div className='text-2xl flex items-center gap-32 justify-between'>
              <div>{cartProductsCount} товарів:</div>
              <div className='font-semibold'>{cartProductsTotalPrice} ₴</div>
            </div>
            <div className='text-2xl flex items-center gap-32 justify-between'>
              <div>Знижка:</div>
              <div className='font-semibold'>3000 $</div>
            </div>
          </div>

          <div className='w-full h-0.5 bg-neutral-100 opacity-100 dark:opacity-50' />

          <div className='flex flex-col gap-10'>
            <div className='flex items-center gap-32 justify-between'>
              <div className='text-3xl'>До сплати: </div>
              <div className='font-semibold text-3xl'>{cartProductsTotalPrice} ₴</div>
            </div>
            <Link href={routes.ordering}>
              <Button
                // onClick={buyProducts}
                giant
                primary
                className='w-full text-center flex justify-center'>
                Оформлення
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ordering;
