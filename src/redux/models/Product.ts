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
  info: {
    method: string;
    city: string;
    address: string;
    phone: string;
    email: string;
    firstName: string;
    lastName: string;
    patronymic: string;
  };
}
