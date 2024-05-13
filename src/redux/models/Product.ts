export interface IProductItem {
  image: {
    large: string;
    thumbnail?: string;
    back: string | null;
    front: string | null;
  };
  product: {
    id: string;
    category: string;
    model: string;
    brand: string;
    price: number;
    version: string;
  };
}

export interface IProductCartItem extends IProductItem {
  count: number;
}

export interface IOrderedItem extends IProductCartItem {
  date: number;
  info: {
    method: {
      id: string;
      type: string;
    };
    city: {
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
      StreetsAvailability: string;
      Warehouses: string;
    };
    address: {
      Present: string;
      Description: string;
      SettlementRef: string;
      SettlementStreetDescription: string;
      SettlementStreetRef: string;
      StreetsType: string;
    };
    phone: string;
    email: string;
    firstName: string;
    lastName: string;
    patronymic: string;
  };
}
