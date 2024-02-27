/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  error: null | string;
}

const initialState: IInitialState = {
  error: null,
};

const errorsCreate = (state: IInitialState, { payload }: PayloadAction<{ message: string }>) => {
  state.error = payload.message;
};

const errorsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    failedFetchCitiesError: errorsCreate,
    failedFetchAdressesError: errorsCreate,
    failedFetchOfficesError: errorsCreate,
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const errorsActions = errorsSlice.actions;
export default errorsSlice.reducer;
