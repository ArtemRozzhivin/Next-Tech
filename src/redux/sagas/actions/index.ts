/* eslint-disable no-unused-vars */
import types from '@redux/sagas/actions/types';
import { IUser } from '../../models/IUser';

const loginAsync = (
  credentials: {
    email: string;
    password: string;
  },
  callback = () => {},
) => ({
  type: types.LOGIN_ASYNC,
  payload: {
    credentials,
    callback,
  },
});

const signupAsync = (
  data: {
    email: string;
    password: string;
  },
  t?: (string: string) => {},
  callback = (res: any) => {},
) => ({
  type: types.SIGNUP_ASYNC,
  payload: {
    data,
    callback,
    t,
  },
});

const updateUserProfileAsync = (data: Partial<IUser>, callback = (item: any) => {}) => ({
  type: types.UPDATE_USER_PROFILE_ASYNC,
  payload: { data, callback },
});

const deleteAccountAsync = (
  errorCallback?: (e: string) => {},
  successCallback?: (str?: string) => void,
  deletionFeedback?: string,
  t?: (str: string) => {},
) => {
  return {
    type: types.DELETE_ACCOUNT_ASYNC,
    payload: {
      errorCallback,
      successCallback,
      t,
      deletionFeedback,
    },
  };
};

const logout = (basedOn401Error: boolean, isLogoutAll: boolean) => {
  return {
    type: types.LOGOUT,
    payload: { basedOn401Error, isLogoutAll },
  };
};

const sagaActions = {
  loginAsync,
  signupAsync,
  updateUserProfileAsync,
  deleteAccountAsync,
  logout,
};

export default sagaActions;
