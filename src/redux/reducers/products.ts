/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import _filter from 'lodash/filter';
import _map from 'lodash/map';
import { User } from 'firebase/auth';
import { IProductItem } from '../models';

interface IProductsState {
  products: IProductItem[];
  cartProducts: IProductItem[];
  cartProductsCount?: number;
}

const initialState: IProductsState = {
  products: [],
  cartProducts: [],
  cartProductsCount: 0,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, { payload }: PayloadAction<IProductItem[]>) => {
      state.products = { ...state.products, ...payload };
    },

    addToCart: (state, { payload }: PayloadAction<IProductItem>) => {
      state.cartProducts = [...state.cartProducts, payload];
      state.cartProductsCount = state.cartProducts.length;
    },
  },
});

export const productsActions = productsSlice.actions;

export default productsSlice.reducer;
