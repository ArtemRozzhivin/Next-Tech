import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import _filter from 'lodash/filter';
import _map from 'lodash/map';
import { IOrderedItem, IProductCartItem, IProductItem } from '../../models';

const calculateTotalCount = (cartProducts: IProductCartItem[]) => {
  return cartProducts.reduce((total, cartItem) => total + cartItem.count, 0);
};

const calculateTotalPrice = (cartProducts: IProductCartItem[]): number => {
  return cartProducts.reduce(
    (total, cartItem) => total + cartItem.product.price * cartItem.count,
    0,
  );
};

export interface IUserHistory {
  user: string;
  purchases: IOrderedItem[] | null;
  wishlist: IProductItem[] | null;
}

interface IProductsState {
  products: IProductItem[];
  userHistory: IUserHistory | null;
  cartProducts: IProductCartItem[];
  currentDetailProduct: IProductItem | null;
  currentProductToCart: IProductCartItem | null;
  productToOrdering: IProductCartItem[];
  productsCountToOrdering: number;
  productsPriceToOrdering: number;
  cartTotalCount: number;
}

const initialState: IProductsState = {
  products: [],
  cartProducts: [],
  productToOrdering: [],
  currentDetailProduct: null,
  userHistory: null,
  currentProductToCart: null,
  productsCountToOrdering: 0,
  productsPriceToOrdering: 0,
  cartTotalCount: 0,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, { payload }: PayloadAction<IProductItem[]>) => {
      state.products = { ...state.products, ...payload };
    },

    setUserHistory: (state, { payload }: PayloadAction<IUserHistory>) => {
      state.userHistory = payload;
    },

    setCurrentProductToCart: (state, { payload }: PayloadAction<IProductCartItem>) => {
      state.currentProductToCart = payload;
    },

    setProductsToCart: (state, { payload }: PayloadAction<IProductCartItem[]>) => {
      state.cartProducts = payload;
      state.cartTotalCount = calculateTotalCount(state.cartProducts);
    },

    addToCart: (state, { payload }: PayloadAction<IProductCartItem>) => {
      state.cartProducts = [...state.cartProducts, payload];
      state.cartTotalCount = calculateTotalCount(state.cartProducts);
    },

    setProductToOrdering: (state, { payload }: PayloadAction<IProductCartItem[]>) => {
      state.productToOrdering = payload;
      state.productsCountToOrdering = calculateTotalCount(state.productToOrdering);
      state.productsPriceToOrdering = calculateTotalPrice(state.productToOrdering);
    },

    addProductToOrdering: (state, { payload }: PayloadAction<IProductCartItem>) => {
      state.productToOrdering = [...state.productToOrdering, payload];
      state.productsCountToOrdering = calculateTotalCount(state.productToOrdering);
      state.productsPriceToOrdering = calculateTotalPrice(state.productToOrdering);
    },

    removeFromProductToOrdering: (state, { payload }: PayloadAction<string>) => {
      const productToOrdering = _filter(
        state.productToOrdering,
        (item) => item.product.id !== payload,
      );
      state.productToOrdering = productToOrdering;
      state.productsCountToOrdering = calculateTotalCount(state.productToOrdering);
      state.productsPriceToOrdering = calculateTotalPrice(state.productToOrdering);
    },

    plusProductCart: (state, { payload }: PayloadAction<string>) => {
      const existingCartItem = state.cartProducts.find((item) => item.product.id === payload);
      const existingProductToOrdering = state.productToOrdering.find(
        (item) => item.product.id === payload,
      );

      if (existingProductToOrdering) {
        existingProductToOrdering.count += 1;
        state.productsCountToOrdering = calculateTotalCount(state.productToOrdering);
        state.productsPriceToOrdering = calculateTotalPrice(state.productToOrdering);
      }

      if (existingCartItem) {
        existingCartItem.count += 1;
        state.cartTotalCount = calculateTotalCount(state.cartProducts);
      }

      state.currentProductToCart = {
        ...state.currentProductToCart,
        count: ++state.currentProductToCart.count,
      };
    },

    minusProductCart: (state, { payload }: PayloadAction<string>) => {
      const existingCartItem = state.cartProducts.find((item) => item.product.id === payload);
      const existingProductToOrdering = state.productToOrdering.find(
        (item) => item.product.id === payload,
      );

      if (existingProductToOrdering && existingCartItem.count > 1) {
        existingProductToOrdering.count -= 1;
        state.productsCountToOrdering = calculateTotalCount(state.productToOrdering);
        state.productsPriceToOrdering = calculateTotalPrice(state.productToOrdering);
      }

      if (existingCartItem && existingCartItem.count > 1) {
        existingCartItem.count -= 1;
        state.cartTotalCount = calculateTotalCount(state.cartProducts);
      } else if (existingCartItem && existingCartItem.count === 1) {
        return state;
      }

      state.currentProductToCart = {
        ...state.currentProductToCart,
        count: --state.currentProductToCart.count,
      };
    },

    clearCart: (state) => {
      state.cartProducts = [];
      state.productToOrdering = [];
      state.productsCountToOrdering = 0;
      state.productsPriceToOrdering = 0;
      state.cartTotalCount = 0;
    },

    removeFromCart: (state, { payload }: PayloadAction<string>) => {
      const cartProducts = _filter(state.cartProducts, (item) => item.product.id !== payload);
      state.cartProducts = cartProducts;
      state.cartTotalCount = calculateTotalCount(state.cartProducts);

      const produtsToOrdering = _filter(
        state.productToOrdering,
        (item) => item.product.id !== payload,
      );
      state.productToOrdering = produtsToOrdering;
      state.productsCountToOrdering = calculateTotalCount(state.productToOrdering);
      state.productsPriceToOrdering = calculateTotalPrice(state.productToOrdering);
    },

    setCurrentDetailProduct: (state, { payload }: PayloadAction<IProductItem>) => {
      state.currentDetailProduct = payload;
    },

    clearProductsToOrdering: (state) => {
      state.productToOrdering = [];
      state.productsCountToOrdering = 0;
      state.productsPriceToOrdering = 0;
    },
  },
});

export const productsActions = productsSlice.actions;

export default productsSlice.reducer;
