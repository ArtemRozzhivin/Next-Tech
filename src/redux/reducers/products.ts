import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import _filter from 'lodash/filter';
import _map from 'lodash/map';
import { User } from 'firebase/auth';
import { IProductCartItem, IProductItem } from '../models';

const calculateTotalCount = (cartProducts: IProductCartItem[]) => {
  console.log(cartProducts.reduce((total, cartItem) => total + cartItem.count, 0));
  return cartProducts.reduce((total, cartItem) => total + cartItem.count, 0);
};

const calculateTotalPrice = (cartProducts: IProductCartItem[]): number => {
  return cartProducts.reduce(
    (total, cartItem) => total + cartItem.product.price * cartItem.count,
    0,
  );
};

interface IProductsState {
  products: IProductItem[];
  cartProducts: IProductCartItem[];
  cartProductsCount: number;
  cartProductsTotalPrice: number;
}

const initialState: IProductsState = {
  products: [],
  cartProducts: [],
  cartProductsCount: 0,
  cartProductsTotalPrice: 0,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, { payload }: PayloadAction<IProductItem[]>) => {
      state.products = { ...state.products, ...payload };
    },

    addToCart: (state, { payload }: PayloadAction<IProductCartItem>) => {
      state.cartProducts = [...state.cartProducts, payload];
      state.cartProductsCount = calculateTotalCount(state.cartProducts);
      state.cartProductsTotalPrice = calculateTotalPrice(state.cartProducts);
    },

    plusProductCart: (state, { payload }: PayloadAction<string>) => {
      const existingCartItem = state.cartProducts.find((item) => item.product.id === payload);

      if (existingCartItem) {
        existingCartItem.count += 1;
      }

      state.cartProductsCount = calculateTotalCount(state.cartProducts);
      state.cartProductsTotalPrice = calculateTotalPrice(state.cartProducts);
    },

    minusProductCart: (state, { payload }: PayloadAction<string>) => {
      const existingCartItem = state.cartProducts.find((item) => item.product.id === payload);

      if (existingCartItem && existingCartItem.count > 1) {
        existingCartItem.count -= 1;
      } else if (existingCartItem && existingCartItem.count === 1) {
        return state;
      }

      state.cartProductsCount = calculateTotalCount(state.cartProducts);
      state.cartProductsTotalPrice = calculateTotalPrice(state.cartProducts);
    },

    clearCart: (state) => {
      state.cartProducts = [];
      state.cartProductsCount = 0;
      state.cartProductsTotalPrice = 0;
    },

    removeFromCart: (state, { payload }: PayloadAction<IProductCartItem>) => {
      const cartProducts = _filter(
        state.cartProducts,
        (product) => product.product.id !== payload.product.id,
      );
      state.cartProducts = cartProducts;
      state.cartProductsCount = calculateTotalCount(state.cartProducts);
      state.cartProductsTotalPrice = calculateTotalPrice(state.cartProducts);
    },
  },
});

export const productsActions = productsSlice.actions;

export default productsSlice.reducer;
