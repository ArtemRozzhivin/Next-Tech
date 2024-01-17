/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import _filter from 'lodash/filter';
import _map from 'lodash/map';
import { IUser } from '../models/IUser';

interface IAuthState {
  user: IUser;
  redirectPath: string | null;
  authenticated: boolean;
  loading: boolean;
}

const initialState: IAuthState = {
  user: {} as IUser,
  redirectPath: null,
  authenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    finishLoading: (state) => {
      state.loading = false;
    },
    loginSuccessful: (state, { payload }: PayloadAction<IUser>) => {
      state.user = payload;
      state.authenticated = true;
    },
    signupUpSuccessful: (state, { payload }: PayloadAction<IUser>) => {
      state.user = payload;
      state.authenticated = true;
    },
    logout: (state) => {
      state.user = {} as IUser;
      state.authenticated = false;
    },
    savePath: (state, { payload }: PayloadAction<string>) => {
      state.redirectPath = payload;
    },
    deleteAccountSuccess: (state) => {
      state.user = {} as IUser;
      state.authenticated = false;
    },
    updateUserData: (state, { payload }: PayloadAction<IUser>) => {
      state.user = { ...state.user, ...payload };
    },
    setUser: (state, { payload }: PayloadAction<IUser>) => {
      state.user = { ...state.user, ...payload };
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
