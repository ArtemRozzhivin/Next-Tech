/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  fetchCitiesError: null | string;
  fetchAdressesError: null | string;
  fetchOfficesError: null | string;
}

const initialState: IInitialState = {
  fetchCitiesError: null,
  fetchAdressesError: null,
  fetchOfficesError: null,
};

const errorsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    failedFetchCitiesError: (
      state: IInitialState,
      { payload }: PayloadAction<{ message: string }>,
    ) => {
      state.fetchCitiesError = payload.message;
    },
    failedFetchAdressesError: (
      state: IInitialState,
      { payload }: PayloadAction<{ message: string }>,
    ) => {
      state.fetchAdressesError = payload.message;
    },
    failedFetchOfficesError: (
      state: IInitialState,
      { payload }: PayloadAction<{ message: string }>,
    ) => {
      state.fetchOfficesError = payload.message;
    },
    clearErrors: (state) => {
      state.fetchAdressesError = null;
      state.fetchCitiesError = null;
      state.fetchOfficesError = null;
    },
  },
});

export const errorsActions = errorsSlice.actions;
export default errorsSlice.reducer;
