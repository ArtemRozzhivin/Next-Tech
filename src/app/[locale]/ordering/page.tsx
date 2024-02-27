'use client';

import React, { ChangeEvent, Fragment } from 'react';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import { Link, useRouter } from '@src/navigation';
import Button from '@src/ui/Button';
import { IUserHistory, productsActions } from '@src/redux/reducers/Products/products';
import { yupResolver } from '@hookform/resolvers/yup';
import ProductOrderingItem from '@src/components/ProductOrderingItem';
import Input from '@src/ui/Input';
import Image from 'next/image';
import novaPoshta from '@src/assets/novaPoshta.svg';
import comfy from '@src/assets/comfy.svg';
import cx from 'clsx';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { FaceFrownIcon, FaceSmileIcon, MapIcon } from '@heroicons/react/24/outline';
import Modal from '@src/ui/Modal';
import axios from 'axios';
import { useDebouncedCallback } from 'use-debounce';
import { InputPhone } from '@src/ui/InputPhone';
import PagePlaceholder from '@src/components/PagePlaceholder';
import Loader from '@src/components/Loader';
import { errorsActions } from '@src/redux/reducers/errors';
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { validation } from './validation';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '@src/firebaseConfig';
import { getUserHistory } from '@src/api/user';

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

interface IOfficeAdress {
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

interface IOrderingSearchCityModal {
  allCities: ICity[];
  isSearchCityOpen: boolean;
  setIsSearchCityOpen: (value: boolean) => void;
  searchCity: string;
  handleCityClick: (value: ICity) => void;
  handleCityInput: (value: string) => void;
  handleCityClear: () => void;
}

const OrderingSearchCityModal = ({
  allCities,
  isSearchCityOpen,
  setIsSearchCityOpen,
  searchCity,
  handleCityClick,
  handleCityInput,
  handleCityClear,
}: IOrderingSearchCityModal) => {
  const { setValue, getValues, getFieldState, control } = useFormContext();
  const { error } = getFieldState('city');
  const city = getValues('city');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, 'city'>,
  ) => {
    handleCityInput(e.target.value);
    field.onChange(e.target.value);
  };

  const handleClickOnCity = (city: ICity) => {
    handleCityClick(city);
    setValue('city', city.Present);
  };

  const handleClickClear = () => {
    handleCityClear();
    setValue('city', '');
  };

  return (
    <>
      <div className='flex flex-col gap-1'>
        <button
          type='button'
          onClick={() => setIsSearchCityOpen(true)}
          className='flex items-center justify-between text-left rounded-md bg-black/20 p-4 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'>
          {city ? <div>{city}</div> : <div>Оберіть ваше місто</div>}
          <div>
            <ChevronDownIcon className='w-7 h-7' />
          </div>
        </button>
        {error && (
          <p className='mt-2 text-sm text-red-600' id='email-error'>
            {error.message}
          </p>
        )}
      </div>
      <Modal
        size='medium'
        isOpened={isSearchCityOpen}
        onClose={() => setIsSearchCityOpen(false)}
        title='Оберіть місто'
        type='info'>
        <div className='flex flex-col gap-5'>
          <Controller
            name='city'
            control={control}
            render={({ field, fieldState }) => (
              <Input
                icon={<MapIcon className='w-5 h-5' />}
                name='city'
                label='Місто доставки'
                value={field.value}
                onChange={(e) => handleChange(e, field)}
                className='rounded text-xl'
                clearIcon
                onClear={handleClickClear}
              />
            )}
          />

          <div className='max-h-80 overflow-auto flex flex-col gap-2 my-3'>
            {allCities.length === 0 && !searchCity ? (
              <PagePlaceholder
                title='You have not entered a city name yet'
                description='Please enter a city name '
                icon={<FaceSmileIcon className='text-colorMain w-20 h-20' />}
              />
            ) : allCities.length === 0 && searchCity && error ? (
              <PagePlaceholder
                title={error}
                description='Please enter a city name '
                icon={<FaceFrownIcon className='text-colorMain w-20 h-20' />}
              />
            ) : allCities.length === 0 && searchCity ? (
              <div className='flex justify-center items-center'>
                <Loader />
              </div>
            ) : (
              <div>
                {allCities.map((city) => (
                  <Button onClick={() => handleClickOnCity(city)} giant noBorder>
                    {city.Present}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

interface IOrderingSearchAdressModal {
  allAdresses: IAdress[];
  isSearchAdressOpen: boolean;
  setIsSearchAdressOpen: (value: boolean) => void;
  searchAdress: string;
  handleAdressInput: (e: ChangeEvent<HTMLInputElement>) => void;
  handleAdressClick: (value: IAdress) => void;
  handleAdressClear: () => void;
}

const OrderingSearchAdressModal = ({
  allAdresses,
  isSearchAdressOpen,
  setIsSearchAdressOpen,
  searchAdress,
  handleAdressInput,
  handleAdressClick,
  handleAdressClear,
}: IOrderingSearchAdressModal) => {
  const { setValue, getValues, getFieldState, control } = useFormContext();
  const { error } = getFieldState('adress');
  const adress = getValues('adress');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, 'adress'>,
  ) => {
    handleAdressInput(e);
    field.onChange(e.target.value);
  };

  const handleClickOnAdress = (adress: IAdress) => {
    handleAdressClick(adress);
    setValue('adress', adress.Present);

    console.log(adress, 'ADRESSObj');
  };

  const handleClickClear = () => {
    handleAdressClear();
    setValue('adress', '');
  };

  return (
    <>
      <div className='flex flex-col gap-1'>
        <button
          type='button'
          onClick={() => setIsSearchAdressOpen(true)}
          className='flex items-center justify-between gap-5 text-left rounded-md bg-black/20 p-4 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'>
          {adress ? <div>{adress}</div> : <div>Оберіть ваше адресу</div>}
          <div>
            <ChevronDownIcon className='w-7 h-7' />
          </div>
        </button>
        {error && (
          <p className='mt-2 text-sm text-red-600' id='email-error'>
            {error.message}
          </p>
        )}
      </div>

      <Modal
        size='medium'
        isOpened={isSearchAdressOpen}
        onClose={() => setIsSearchAdressOpen(false)}
        title='Оберіть вашу адресу'
        type='info'>
        <div className='flex flex-col gap-5'>
          <Controller
            name='adress'
            control={control}
            render={({ field, fieldState }) => (
              <Input
                label='Вашу адреса'
                value={field.value}
                onChange={(e) => handleChange(e, field)}
                name='adress'
                clearIcon
                onClear={handleClickClear}
              />
            )}
          />

          <div className='max-h-80 overflow-auto flex flex-col gap-2 my-3'>
            {allAdresses.length === 0 && !searchAdress ? (
              <PagePlaceholder
                title='You have not entered a adress yet'
                description='Please enter a adress '
                icon={<FaceSmileIcon className='text-colorMain w-20 h-20' />}
              />
            ) : allAdresses.length === 0 && searchAdress ? (
              // <div>
              //   <PagePlaceholder
              //     title='This address was not found in this city'
              //     description='Try entering a different name'
              //   />
              // </div>
              <div className='flex justify-center items-center'>
                <Loader />
              </div>
            ) : (
              <div>
                <div className='flex flex-col gap-2'>
                  {allAdresses.map((item) => (
                    <Button onClick={() => handleClickOnAdress(item)} giant noBorder>
                      {item.Present}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

interface IOrderingSearchAdressModal {
  allOfficeAdresses: IOfficeAdress[];
  isSearchOfficeAdressOpen: boolean;
  setIsSearchOfficeAdressOpen: (value: boolean) => void;
  searchOfficeAdress: string;
  handleOfficeAdressInput: (e: ChangeEvent<HTMLInputElement>) => void;
  handleOfficeAdressClick: (value: IOfficeAdress) => void;
  handleOfficeAdressClear: () => void;
}

const OrderingSearchOfficeAddressModal = ({
  allOfficeAdresses,
  isSearchOfficeAdressOpen,
  setIsSearchOfficeAdressOpen,
  searchOfficeAdress,
  handleOfficeAdressInput,
  handleOfficeAdressClick,
  handleOfficeAdressClear,
}: IOrderingSearchAdressModal) => {
  const { setValue, getValues, getFieldState, control } = useFormContext();
  const { error } = getFieldState('officeAdress');
  const officeAdress = getValues('officeAdress');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, 'officeAdress'>,
  ) => {
    handleOfficeAdressInput(e);
    field.onChange(e.target.value);
  };

  console.log(officeAdress, 'officeAdress');

  const handleClickOnOfficeAdress = (officeAdress: IOfficeAdress) => {
    handleOfficeAdressClick(officeAdress);
    setValue('officeAdress', officeAdress.Description);
  };

  const handleClickClear = () => {
    handleOfficeAdressClear();
    setValue('officeAdress', '');
  };

  return (
    <>
      <div className='w-full flex flex-col gap-1'>
        <button
          type='button'
          onClick={() => setIsSearchOfficeAdressOpen(true)}
          className='flex items-center justify-between gap-5 text-left rounded-md bg-black/20 p-4 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'>
          {officeAdress ? (
            <div>{officeAdress}</div>
          ) : (
            <div>Оберіть номер відділення або поштомат</div>
          )}
          <div>
            <ChevronDownIcon className='w-7 h-7' />
          </div>
        </button>
        {error && (
          <p className='mt-2 text-sm text-red-600' id='email-error'>
            {error.message}
          </p>
        )}
      </div>

      <Modal
        size='medium'
        isOpened={isSearchOfficeAdressOpen}
        onClose={() => setIsSearchOfficeAdressOpen(false)}
        title='Оберіть номер відділення або поштомат'
        type='info'>
        <div className='flex flex-col gap-5'>
          <Controller
            name='officeAdress'
            control={control}
            render={({ field, fieldState }) => (
              <Input
                label='Оберіть номер відділення або поштомат'
                value={field.value}
                onChange={(e) => handleChange(e, field)}
                name='officeAdress'
                clearIcon
                onClear={handleClickClear}
              />
            )}
          />

          <div className='max-h-80 overflow-auto flex flex-col gap-2 my-3'>
            {allOfficeAdresses.length === 0 && !searchOfficeAdress ? (
              <PagePlaceholder
                title='You have not entered a adress yet'
                description='Please enter a adress '
                icon={<FaceSmileIcon className='text-colorMain w-20 h-20' />}
              />
            ) : allOfficeAdresses.length === 0 && searchOfficeAdress ? (
              <div>
                <PagePlaceholder
                  title='This address was not found in this city'
                  description='Try entering a different name'
                />
              </div>
            ) : (
              <div>
                <div className='flex flex-col gap-2'>
                  {allOfficeAdresses.map((item: IOfficeAdress) => (
                    <Button onClick={() => handleClickOnOfficeAdress(item)} giant noBorder>
                      {item.Description}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

const PersonalInfoForm = () => {
  const { control } = useFormContext();

  return (
    <div className='flex items-center gap-5'>
      <Controller
        name='lastName'
        control={control}
        render={({ field, fieldState }) => (
          <Input
            name='lastName'
            type='text'
            label='Прізвище'
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name='firstName'
        control={control}
        render={({ field, fieldState }) => (
          <Input
            name='firstName'
            type='text'
            label="Ім'я"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name='patronymic'
        control={control}
        render={({ field, fieldState }) => (
          <Input
            name='patronymic'
            type='text'
            label='По батькові'
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            error={fieldState.error?.message}
          />
        )}
      />
    </div>
  );
};

const HouseInfoForm = () => {
  const { control } = useFormContext();

  return (
    <div className='flex items-center gap-5'>
      <Controller
        name='house'
        control={control}
        render={({ field, fieldState }) => (
          <Input
            name='house'
            type='text'
            label='Будинок'
            value={field.value}
            placeholder='Ваш будинок'
            onChange={(e) => field.onChange(e.target.value)}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name='flat'
        control={control}
        render={({ field, fieldState }) => (
          <Input
            name='flat'
            type='text'
            label='Квартира'
            value={field.value}
            placeholder='Ваша квартира'
            onChange={(e) => field.onChange(e.target.value)}
            error={fieldState.error?.message}
          />
        )}
      />
    </div>
  );
};

interface IFormData {
  phone: string;
  lastName: string;
  firstName: string;
  patronymic: string;
  house?: string;
  flat?: string;
  city?: string;
  adress?: string;
  officeAdress?: string;
}

const defaultValues: IFormData = {
  phone: '',
  lastName: '',
  firstName: '',
  patronymic: '',
  house: '',
  flat: '',
  city: '',
  adress: '',
  officeAdress: '',
};

export const Ordering = () => {
  const { cartProducts, cartProductsCount, cartProductsTotalPrice } = useAppSelector(
    (state) => state.products,
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [currentDelivery, setCurrentDelivery] = React.useState<{ id: string; type: string } | null>(
    null,
  );

  const [isSearchCityOpen, setIsSearchCityOpen] = React.useState<boolean>(false);
  const [searchCity, setSearchCity] = React.useState<string>('');
  const [allCities, setAllCities] = React.useState<ICity[]>([]);
  const [city, setCity] = React.useState<ICity | null>(null);

  const [isSearchAdressOpen, setIsSearchAdressOpen] = React.useState<boolean>(false);
  const [allAdresses, setAllAdresses] = React.useState<IAdress[]>([]);
  const [searchAdress, setSearchAdress] = React.useState<string>('');
  const [address, setAddress] = React.useState<null | IAdress>(null);

  const [isSearchOfficeAddressOpen, setIsSearchOfficeAddressOpen] = React.useState<boolean>(false);
  const [allOfficeAddress, setAllOfficeAddress] = React.useState<IOfficeAdress[]>([]);
  const [searchOfficeAddress, setSearchOfficeAddress] = React.useState<string>('');
  const [officeAddress, setOfficeAddress] = React.useState<null | IOfficeAdress>(null);

  const methods = useForm({
    resolver: yupResolver(validation(currentDelivery?.type)),
    defaultValues,
  });

  const {
    register,
    control,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleDelivery = (id: string, type: string) => {
    if (city === null) return null;

    setCurrentDelivery({ id, type });
    clearErrors();
  };

  const fetchCities = async (value: string) => {
    try {
      dispatch(errorsActions.clearErrors());
      console.log();

      const { data } = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
        apiKey: 'd2525e4f0272ebd8bcf60e2b8d77820e',
        modelName: 'Address',
        calledMethod: 'searchSettlements',
        methodProperties: {
          CityName: value,
          Limit: '50',
          Page: '1',
        },
      });

      if (!data.success) throw new Error(data.errors[0]);

      console.log(data, 'DATA');

      setAllCities(data.data[0].Addresses);
    } catch (error) {
      console.log(error.message, 'ERROR');
      dispatch(errorsActions.failedFetchCitiesError(error));
    }
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

  const debouncedCallback = useDebouncedCallback((callback) => {
    callback();
  }, 1500);

  const handleCityInput = (value: string) => {
    debouncedCallback(() => fetchCities(value));
  };

  const handleCityClear = () => {
    setAllCities([]);
    setCity(null);
    setCurrentDelivery(null);
  };

  const handleCityClick = (value: ICity) => {
    setCity(value);
    setIsSearchCityOpen(false);
  };

  const handleAdressInput = (e: any) => {
    setSearchAdress(e.target.value);

    debouncedCallback(() => fetchAdress(e.target.value));
  };

  const handleAdressClear = () => {
    setAllAdresses([]);
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

  const handleOfficeAdressClick = (value: IOfficeAdress) => {
    setOfficeAddress(value);
    setSearchOfficeAddress(value.Description);
    setIsSearchOfficeAddressOpen(false);
  };

  const handleOfficeAdressClear = () => {
    setAllOfficeAddress([]);
  };

  const redirectToPreviousPage = () => {
    router.back();
  };

  const clearCart = () => {
    if (window.confirm('Ви впевнені, що хочете очистити кошик?')) {
      dispatch(productsActions.clearCart());
    }
  };

  const onSubmit = async (data) => {
    console.log(data, 'DATA');

    if (Object.keys(errors).length !== 0) {
      return;
    }

    if (user) {
      try {
        const orderedProducts = cartProducts.map((item) => {
          return {
            ...item,
            info: {
              method: currentDelivery,
              city: city,
              address: currentDelivery?.type === 'office' ? officeAddress : address,
              phone: data.phone,
              firstName: data.firstName,
              lastName: data.lastName,
              patronymic: data.patronymic,
            },
          };
        });

        const productRef = doc(db, 'users', user.uid);

        await updateDoc(productRef, {
          purchases: arrayUnion(...orderedProducts),
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
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className='flex items-start gap-3'>
          <div className='flex-1 flex flex-col gap-5'>
            <div className='flex flex-col gap-5'>
              <div className='text-2xl font-semibold'>1. Товари</div>
              <div className='flex flex-col gap-3 justify-center items-center'>
                {cartProducts.map((item) => (
                  <div className='rounded-md w-full bg-lightmain p-5'>
                    <ProductOrderingItem key={item.product.version} {...item} />
                  </div>
                ))}
              </div>
            </div>

            <div className='flex flex-col gap-5'>
              <div className='text-2xl font-semibold'>2. Контактна інформація</div>
              <div className='rounded-md p-5 bg-lightmain'>
                <div className='flex items-center gap-20'>
                  <Controller
                    name='phone'
                    control={control}
                    render={({ field, fieldState }) => (
                      <>
                        <InputPhone
                          name='phone'
                          label='Номер телефону'
                          value={field.value}
                          placeholder='+380 96 335 0479'
                          onChange={(value) => field.onChange(value)}
                          error={fieldState.error?.message}
                        />
                      </>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-5'>
              <div className='text-2xl font-semibold'>3. Спосіб доставки</div>
              <div className='flex flex-col gap-5 rounded-md p-5 bg-lightmain'>
                <>
                  <OrderingSearchCityModal
                    isSearchCityOpen={isSearchCityOpen}
                    setIsSearchCityOpen={setIsSearchCityOpen}
                    handleCityInput={handleCityInput}
                    allCities={allCities}
                    searchCity={searchCity}
                    handleCityClick={handleCityClick}
                    handleCityClear={handleCityClear}
                  />
                </>

                <div className='flex flex-col gap-5'>
                  <div
                    onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                      handleDelivery(e.currentTarget.id, 'courier')
                    }
                    id='courier-nova-poshta'
                    className={cx(
                      'p-5 rounded-md border border-colorMain flex flex-col gap-5',
                      !city && 'border-gray-400',
                    )}>
                    <div className='flex items-center gap-3'>
                      <div
                        className={cx(
                          'w-5 h-5 rounded-full border border-colorMain',
                          currentDelivery?.id === 'courier-nova-poshta' && 'bg-colorMain',
                          !city && 'border-gray-400',
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
                    {currentDelivery?.id === 'courier-nova-poshta' && (
                      <div className='flex flex-col gap-5'>
                        <div>
                          <>
                            <OrderingSearchAdressModal
                              allAdresses={allAdresses}
                              isSearchAdressOpen={isSearchAdressOpen}
                              handleAdressClick={handleAdressClick}
                              handleAdressClear={handleAdressClear}
                              handleAdressInput={handleAdressInput}
                              searchAdress={searchAdress}
                              setIsSearchAdressOpen={setIsSearchAdressOpen}
                            />
                          </>
                        </div>

                        <HouseInfoForm />

                        <PersonalInfoForm />
                      </div>
                    )}
                  </div>

                  <div
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      handleDelivery(e.currentTarget.id, 'courier')
                    }
                    id='courier-comfy'
                    className={cx(
                      'p-5 rounded-md border border-colorMain flex flex-col gap-5',
                      !city && 'border-gray-400',
                    )}>
                    <div className='flex items-center gap-3'>
                      <div
                        className={cx(
                          'w-5 h-5 rounded-full border border-colorMain',
                          currentDelivery?.id === 'courier-comfy' && 'bg-colorMain',
                          !city && 'border-gray-400',
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
                    {currentDelivery?.id === 'courier-comfy' && (
                      <div className='flex flex-col gap-5'>
                        <div>
                          <>
                            <OrderingSearchAdressModal
                              allAdresses={allAdresses}
                              isSearchAdressOpen={isSearchAdressOpen}
                              handleAdressClick={handleAdressClick}
                              handleAdressClear={handleAdressClear}
                              handleAdressInput={handleAdressInput}
                              searchAdress={searchAdress}
                              setIsSearchAdressOpen={setIsSearchAdressOpen}
                            />
                          </>
                        </div>

                        <HouseInfoForm />

                        <PersonalInfoForm />
                      </div>
                    )}
                  </div>

                  <div
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      handleDelivery(e.currentTarget.id, 'office')
                    }
                    id='to-nova-poshta-office'
                    className={cx(
                      'p-5 rounded-md border border-colorMain flex flex-col gap-5',
                      !city && 'border-gray-400',
                    )}>
                    <div className='flex items-center gap-3'>
                      <div
                        className={cx(
                          'w-5 h-5 rounded-full border border-colorMain',
                          currentDelivery?.id === 'to-nova-poshta-office' && 'bg-colorMain',
                          !city && 'border-gray-400',
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
                    {currentDelivery?.id === 'to-nova-poshta-office' && (
                      <div className='flex flex-col gap-5'>
                        <div className='flex items-center gap-5'>
                          <OrderingSearchOfficeAddressModal
                            allOfficeAdresses={allOfficeAddress}
                            isSearchOfficeAdressOpen={isSearchOfficeAddressOpen}
                            handleOfficeAdressClick={handleOfficeAdressClick}
                            handleOfficeAdressClear={handleOfficeAdressClear}
                            handleOfficeAdressInput={handleOfficeAdressInput}
                            searchOfficeAdress={searchOfficeAddress}
                            setIsSearchOfficeAdressOpen={setIsSearchOfficeAddressOpen}
                          />
                        </div>

                        <PersonalInfoForm />
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
              {/* <Link href={routes.ordering}> */}
              <Button
                type='submit'
                primary
                giant
                gray={Object.keys(errors).length !== 0 || !methods.formState.isValid}
                className='w-full text-center flex justify-center'>
                Оформлення
              </Button>
              {/* </Link> */}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Ordering;
