'use client';

import React, { ChangeEvent, Fragment } from 'react';
import { useAppDispatch, useAppSelector } from '@src/redux/hooks';
import Button from '@src/ui/Button';
import { IUserHistory, productsActions } from '@src/redux/reducers/Products/products';
import { yupResolver } from '@hookform/resolvers/yup';
import ProductOrderingItem from '@src/components/Product/OrderingItem';
import Input from '@src/ui/Input';
import Image from 'next/image';
import novaPoshta from '@src/assets/novaPoshta.svg';
import comfy from '@src/assets/comfy.svg';
import cx from 'clsx';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  FaceFrownIcon,
  FaceSmileIcon,
  HomeModernIcon,
  MapIcon,
} from '@heroicons/react/24/outline';
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
import { set } from 'lodash';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

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
  handleCityClick: (value: ICity) => void;
  handleCityInput: (value: string) => void;
  handleCityClear: () => void;
}

const OrderingSearchCityModal = ({
  allCities,
  isSearchCityOpen,
  setIsSearchCityOpen,
  handleCityClick,
  handleCityInput,
  handleCityClear,
}: IOrderingSearchCityModal) => {
  const { setValue, getValues, getFieldState, control } = useFormContext();
  const { fetchCitiesError } = useAppSelector((state) => state.errors);
  const city = getValues('city');
  const { error } = getFieldState('city');

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
          className='flex items-center justify-between text-left rounded-md bg-lightmain p-4 text-sm font-medium text-darkmain'>
          {city ? <div>{city}</div> : <div>Оберіть ваше місто</div>}
          <div>
            <ChevronDownIcon className='w-7 h-7' />
          </div>
        </button>
        {fetchCitiesError && (
          <p className='mt-2 text-sm text-red-600' id='email-error'>
            {fetchCitiesError}
          </p>
        )}
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
                className='pr-9 rounded md:text-xl'
                placeholder='Введіть назву вашого міста'
                clearIcon
                onClear={handleClickClear}
              />
            )}
          />

          <div className='max-h-80 overflow-auto flex flex-col gap-2 my-3'>
            {allCities.length === 0 && !city ? (
              <PagePlaceholder
                title='Ви ще не ввели назву міста'
                description='Будь ласка, введіть назву міста'
                icon={<FaceSmileIcon className='text-colorMain w-20 h-20' />}
              />
            ) : allCities.length === 0 && city && fetchCitiesError ? (
              <PagePlaceholder
                title={fetchCitiesError}
                description='Будь ласка, введіть назву міста'
                icon={<FaceFrownIcon className='text-colorMain w-20 h-20' />}
              />
            ) : allCities.length === 0 && city && !fetchCitiesError ? (
              <div className='flex justify-center items-center'>
                <Loader />
              </div>
            ) : (
              <div>
                {allCities.map((city) => (
                  <Button
                    key={city.Ref}
                    onClick={() => handleClickOnCity(city)}
                    className='text-xs md:px-6 md:py-3 md:text-base'
                    noBorder>
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
  handleAdressInput: (e: ChangeEvent<HTMLInputElement>) => void;
  handleAdressClick: (value: IAdress) => void;
  handleAdressClear: () => void;
}

const OrderingSearchAdressModal = ({
  allAdresses,
  isSearchAdressOpen,
  setIsSearchAdressOpen,
  handleAdressInput,
  handleAdressClick,
  handleAdressClear,
}: IOrderingSearchAdressModal) => {
  const { setValue, getValues, getFieldState, control } = useFormContext();
  const { fetchAdressesError } = useAppSelector((state) => state.errors);
  const adress = getValues('adress');
  const { error } = getFieldState('adress');

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
          className='flex items-center justify-between text-left rounded-md bg-lightmain p-4 text-sm font-medium text-darkmain'>
          {adress ? <div>{adress}</div> : <div>Оберіть ваше адресу</div>}
          <div>
            <ChevronDownIcon className='w-7 h-7' />
          </div>
        </button>
        {fetchAdressesError && (
          <p className='mt-2 text-sm text-red-600' id='email-error'>
            {fetchAdressesError}
          </p>
        )}
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
                label='Адреса доставки'
                placeholder='Введіть вашу адресу'
                value={field.value}
                onChange={(e) => handleChange(e, field)}
                name='adress'
                icon={<HomeModernIcon className='w-5 h-5' />}
                clearIcon
                onClear={handleClickClear}
                className='pr-9'
              />
            )}
          />

          <div className='max-h-80 overflow-auto flex flex-col gap-2 my-3'>
            {allAdresses.length === 0 && !adress ? (
              <PagePlaceholder
                title='Ви ще не ввели адресу'
                description='Будь ласка, введіть адресу'
                icon={<FaceSmileIcon className='text-colorMain w-20 h-20' />}
              />
            ) : allAdresses.length === 0 && adress && fetchAdressesError ? (
              <PagePlaceholder
                title={fetchAdressesError}
                description='Будь ласка, введіть адресу'
                icon={<FaceFrownIcon className='text-colorMain w-20 h-20' />}
              />
            ) : allAdresses.length === 0 && adress && !fetchAdressesError ? (
              <div className='flex justify-center items-center'>
                <Loader />
              </div>
            ) : (
              <div className='flex flex-col gap-2'>
                {allAdresses.map((item) => (
                  <Button
                    key={item.SettlementStreetRef}
                    className='text-xs md:px-6 md:py-3 md:text-base'
                    onClick={() => handleClickOnAdress(item)}
                    giant
                    noBorder>
                    {item.Present}
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
  allOfficeAdresses: IOfficeAdress[];
  isSearchOfficeAdressOpen: boolean;
  setIsSearchOfficeAdressOpen: (value: boolean) => void;
  handleOfficeAdressInput: (e: ChangeEvent<HTMLInputElement>) => void;
  handleOfficeAdressClick: (value: IOfficeAdress) => void;
  handleOfficeAdressClear: () => void;
}

const OrderingSearchOfficeAddressModal = ({
  allOfficeAdresses,
  isSearchOfficeAdressOpen,
  setIsSearchOfficeAdressOpen,
  handleOfficeAdressInput,
  handleOfficeAdressClick,
  handleOfficeAdressClear,
}: IOrderingSearchAdressModal) => {
  const { setValue, getValues, getFieldState, control } = useFormContext();
  const officeAdress = getValues('officeAdress');
  const { fetchOfficesError } = useAppSelector((state) => state.errors);
  const { error } = getFieldState('officeAdress');

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, 'officeAdress'>,
  ) => {
    handleOfficeAdressInput(e);
    field.onChange(e.target.value);
  };

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
          className='flex items-center justify-between text-left rounded-md bg-lightmain p-4 text-sm font-medium text-darkmain'>
          {officeAdress ? (
            <div>{officeAdress}</div>
          ) : (
            <div>Оберіть номер відділення або поштомат</div>
          )}
          <div>
            <ChevronDownIcon className='w-7 h-7' />
          </div>
        </button>
        {fetchOfficesError && (
          <p className='mt-2 text-sm text-red-600' id='email-error'>
            {fetchOfficesError}
          </p>
        )}
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
                icon={<EnvelopeIcon className='w-5 h-5' />}
                placeholder='Введіть номер відділення або поштомат'
                clearIcon
                onClear={handleClickClear}
              />
            )}
          />

          <div className='max-h-80 overflow-auto flex flex-col gap-2 my-3'>
            {allOfficeAdresses.length === 0 && !officeAdress ? (
              <PagePlaceholder
                title='You have not entered a adress yet'
                description='Please enter a adress name '
                icon={<FaceSmileIcon className='text-colorMain w-20 h-20' />}
              />
            ) : allOfficeAdresses.length === 0 && officeAdress && fetchOfficesError ? (
              <PagePlaceholder
                title={fetchOfficesError}
                description='Please enter a city name '
                icon={<FaceFrownIcon className='text-colorMain w-20 h-20' />}
              />
            ) : allOfficeAdresses.length === 0 && officeAdress && !fetchOfficesError ? (
              <div className='flex justify-center items-center'>
                <Loader />
              </div>
            ) : (
              <div className='flex flex-col gap-2'>
                {allOfficeAdresses.map((item: IOfficeAdress) => (
                  <Button
                    key={item.Ref}
                    onClick={() => handleClickOnOfficeAdress(item)}
                    giant
                    noBorder>
                    {item.Description}
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

const PersonalInfoForm = () => {
  const { control } = useFormContext();

  return (
    <div className='flex flex-col md:flex-row items-start md:items-start gap-5'>
      <Controller
        name='lastName'
        control={control}
        render={({ field, fieldState }) => (
          <Input
            name='lastName'
            type='text'
            label='Прізвище'
            placeholder='Прізвище'
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
            placeholder="Ім'я"
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
            placeholder='По батькові'
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
    <div className='flex flex-col xs:flex-row items-start xs:items-center gap-5'>
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
            isOptional
          />
        )}
      />
    </div>
  );
};

const OrderingCheck = ({ isChecked, isActive }: { isChecked: boolean; isActive: boolean }) => {
  return (
    <div
      className={cx(
        'w-5 h-5 rounded-full border border-colorMain flex items-center justify-center',
        isChecked && 'bg-colorMain',
        isActive && 'border-gray-300',
      )}>
      <div className='w-3 h-3 bg-white rounded-full'></div>
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

const novaPoshtaKey = process.env.NEXT_PUBLIC_NOVAPOSHTA_API_KEY;

export const Ordering = () => {
  const { cartProducts, productToOrdering, productsCountToOrdering, productsPriceToOrdering } =
    useAppSelector((state) => state.products);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const [currentDelivery, setCurrentDelivery] = React.useState<{ id: string; type: string } | null>(
    null,
  );
  const [isInfoRight, setIsInfoRight] = React.useState<boolean | null>(null);

  const [isSearchCityOpen, setIsSearchCityOpen] = React.useState<boolean>(false);
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

      const { data } = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
        apiKey: novaPoshtaKey,
        modelName: 'Address',
        calledMethod: 'searchSettlements',
        methodProperties: {
          CityName: value,
          Limit: '50',
          Page: '1',
        },
      });

      if (!data.success) throw new Error(data.errors[0]);
      if (data.success && data.data[0].Addresses.length === 0) throw new Error('Cities not found');

      setAllCities(data.data[0].Addresses);
    } catch (error) {
      console.log(error.message, 'ERROR');
      dispatch(errorsActions.failedFetchCitiesError(error));
    }
  };

  const fetchAdress = async (value: string) => {
    try {
      dispatch(errorsActions.clearErrors());

      const { data } = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
        apiKey: novaPoshtaKey,
        modelName: 'Address',
        calledMethod: 'searchSettlementStreets',
        methodProperties: {
          StreetName: value,
          SettlementRef: city.Ref,
        },
      });

      if (!data.success) throw new Error(data.errors[0]);
      if (data.success && data.data[0].Addresses.length === 0)
        throw new Error('Адреси не знайдено');

      setAllAdresses(data.data[0].Addresses);
    } catch (error) {
      console.log(error.message, 'ERROR');
      dispatch(errorsActions.failedFetchAdressesError(error));
    }
  };

  const fetchOffieceNumber = async (value: string) => {
    try {
      dispatch(errorsActions.clearErrors());

      const { data } = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
        apiKey: novaPoshtaKey,
        modelName: 'Address',
        calledMethod: 'getWarehouses',
        methodProperties: {
          CityRef: city?.DeliveryCity,
          FindByString: value,
        },
      });

      if (!data.success) throw new Error(data.errors[0]);
      if (data.success && data.data.length === 0) {
        setAllOfficeAddress(data.data);
        throw new Error('Adresses not found');
      }

      setAllOfficeAddress(data.data);
    } catch (error) {
      console.log(error.message, 'ERROR');
      dispatch(errorsActions.failedFetchOfficesError(error));
    }
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
    debouncedCallback(() => fetchAdress(e.target.value));
  };

  const handleAdressClear = () => {
    setAllAdresses([]);
  };

  const handleOfficeAdressInput = (e: any) => {
    debouncedCallback(() => fetchOffieceNumber(e.target.value));
  };

  const handleAdressClick = (value: IAdress) => {
    setIsSearchAdressOpen(false);
    setAddress(value);
  };

  const handleOfficeAdressClick = (value: IOfficeAdress) => {
    setOfficeAddress(value);
    setIsSearchOfficeAddressOpen(false);
  };

  const handleOfficeAdressClear = () => {
    setAllOfficeAddress([]);
  };

  const clearCart = () => {
    const newCartProducts = cartProducts.filter(
      (item1) => !productToOrdering.some((item2) => item1.product.id === item2.product.id),
    );

    dispatch(productsActions.setProductsToCart(newCartProducts));
    dispatch(productsActions.clearProductsToOrdering());
  };

  const onSubmit = async (data) => {
    if (Object.keys(errors).length !== 0) {
      return;
    }

    if (user) {
      try {
        const orderedProducts = productToOrdering.map((item) => {
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

        toast.success('Замовлення успішно оформлено');
        clearCart();
      } catch (error) {
        console.log(error);
        toast.error('Невдалося оформити замовлення');
      }
    }

    getUserHistory(user).then((userHistory) => {
      if (userHistory) dispatch(productsActions.setUserHistory(userHistory as IUserHistory));
    });
  };

  const redirectToPreviousPage = () => {
    router.back();
  };

  return (
    <div className='flex flex-col gap-5 p-3 md:p-5'>
      <button
        onClick={redirectToPreviousPage}
        className='flex items-center gap-2 hover:text-colorMain'>
        <ArrowLeftIcon className='w-4 h-4 sm:w-6 sm:h-6' />
        <h2 className='sm:text-xl font-semibold'>Назад</h2>
      </button>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col 2xl:flex-row items-start gap-3'>
          <div className='w-full flex-1 flex flex-col gap-5'>
            <div className='flex flex-col gap-5'>
              <div className='text-2xl font-semibold'>1. Товари</div>
              <div className='flex flex-col gap-3 justify-center items-center'>
                {productToOrdering.map((item) => (
                  <div
                    key={item.product.version}
                    className='border border-gray-300 shadow-sm bg-white rounded-md w-full p-[6px] 2xl:p-5'>
                    <ProductOrderingItem {...item} />
                  </div>
                ))}
              </div>
            </div>

            <div className='flex flex-col gap-5'>
              <div className='text-2xl font-semibold'>2. Контактна інформація</div>
              <div className='w-full rounded-md 2xl:p-5 2xl:border border-gray-300 shadow-sm bg-white'>
                <div className='flex items-center'>
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
              <div className='flex flex-col gap-5 rounded-md p-[6px] 2xl:p-5 border border-gray-300 shadow-sm bg-white'>
                <>
                  <OrderingSearchCityModal
                    isSearchCityOpen={isSearchCityOpen}
                    setIsSearchCityOpen={setIsSearchCityOpen}
                    handleCityInput={handleCityInput}
                    allCities={allCities}
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
                      !city && 'border-gray-300',
                    )}>
                    <div className='flex items-center gap-3'>
                      <OrderingCheck
                        isChecked={currentDelivery?.id === 'courier-nova-poshta'}
                        isActive={!city}
                      />
                      <div className='w-full justify-between flex items-center gap-3'>
                        <div className='text-sm md:text-base'>Кур'єр Нова пошта </div>
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
                              isSearchAdressOpen={isSearchAdressOpen}
                              setIsSearchAdressOpen={setIsSearchAdressOpen}
                              allAdresses={allAdresses}
                              handleAdressClick={handleAdressClick}
                              handleAdressClear={handleAdressClear}
                              handleAdressInput={handleAdressInput}
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
                      !city && 'border-gray-300',
                    )}>
                    <div className='flex items-center gap-3'>
                      <OrderingCheck
                        isChecked={currentDelivery?.id === 'courier-comfy'}
                        isActive={!city}
                      />
                      <div className='w-full flex items-center justify-between gap-3'>
                        <div className='text-sm md:text-base'>Кур'єр COMFY </div>
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
                      !city && 'border-gray-300',
                    )}>
                    <div className='flex items-center gap-3'>
                      <OrderingCheck
                        isChecked={currentDelivery?.id === 'to-nova-poshta-office'}
                        isActive={!city}
                      />
                      <div className='w-full justify-between flex items-center gap-3'>
                        <div className='text-sm md:text-base'>До відділення Нової пошти</div>
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

          <div className='w-full 2xl:w-auto rounded-md flex flex-col gap-4 md:gap-10 border border-gray-300 shadow-sm bg-white p-5'>
            <div className='flex flex-col gap-3'>
              <div className='text-lg sm:text-2xl flex items-center 2xl:gap-32 justify-between'>
                <div>Кількість товарів:</div>
                <div className='font-semibold'>{productsCountToOrdering} шт.</div>
              </div>
              <div className='text-lg sm:text-2xl flex items-center 2xl:gap-32 justify-between'>
                <div>Сумма:</div>
                <div className='font-semibold'>{productsPriceToOrdering}₴</div>
              </div>
            </div>

            <div className='w-full h-0.5 bg-neutral-100 opacity-100 dark:opacity-50' />

            <div className='flex flex-col gap-10'>
              <div className='flex items-center 2xl:gap-32 justify-between'>
                <div className='text-xl sm:text-3xl'>До сплати: </div>
                <div className='font-semibold text-xl sm:text-3xl'>{productsPriceToOrdering}₴</div>
              </div>
              <div className='flex flex-col gap-2'>
                {Object.keys(errors).length !== 0 && isInfoRight && (
                  <div className='text-center text-sm font-semibold text-gray-600'>
                    Заповніть всі поля правильно
                  </div>
                )}
                <Button
                  type='submit'
                  primary
                  onClick={() => setIsInfoRight(true)}
                  giant
                  gray={Object.keys(errors).length !== 0 || !methods.formState.isValid}
                  className='w-full text-center flex justify-center'>
                  Оформлення
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Ordering;
