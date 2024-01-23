import { configureStore } from '@reduxjs/toolkit';
import authSlice from './reducers/auth';
import productsSlice from './reducers/Products/products';

export const makeStore = () => {
  return configureStore({
    reducer: { auth: authSlice, products: productsSlice },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
