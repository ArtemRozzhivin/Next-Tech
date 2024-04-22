/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _filter from 'lodash/filter';
import _map from 'lodash/map';
import { User } from 'firebase/auth';

interface IAuthState {
  user: User | null;
  authenticated: boolean;
  loading: boolean;
}

const initialState: IAuthState = {
  user: null,
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
    loginSuccessful: (state, { payload }: PayloadAction<User>) => {
      state.user = payload;
      state.authenticated = true;
    },
    signupUpSuccessful: (state, { payload }: PayloadAction<User>) => {
      state.user = payload;
      state.authenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.authenticated = false;
    },
    deleteAccountSuccess: (state) => {
      state.user = {} as User;
      state.authenticated = false;
    },
    updateUserData: (state, { payload }: PayloadAction<User>) => {
      state.user = { ...state.user, ...payload };
    },
    setUser: (state, { payload }: PayloadAction<User>) => {
      state.user = { ...state.user, ...payload };
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
