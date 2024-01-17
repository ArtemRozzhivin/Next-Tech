import { takeLatest, all, call } from 'redux-saga/effects';
import signIn from '../workers/signin';
import signUp from '../workers/signup';
import logout from '../workers/logout';
import updateUserProfile from '../workers/updateUserProfile';
import deleteUserAccount from '../workers/deleteUserAccount';

function* watchLogin() {
  // @ts-ignore
  yield takeLatest(sagaTypes.LOGIN_ASYNC, signIn);
}

function* watchSignup() {
  // @ts-ignore
  yield takeLatest(sagaTypes.SIGNUP_ASYNC, signUp);
}

function* watchLogout() {
  // @ts-ignore
  yield takeLatest(sagaTypes.LOGOUT, logout);
}

function* watchUpdateUserProfile() {
  // @ts-ignore
  yield takeLatest(sagaTypes.UPDATE_USER_PROFILE_ASYNC, updateUserProfile);
}

function* watchDeleteUserProfile() {
  // @ts-ignore
  yield takeLatest(sagaTypes.DELETE_ACCOUNT_ASYNC, deleteUserAccount);
}

export default function* watchAuth() {
  yield all([
    call(watchLogin),
    call(watchSignup),
    call(watchUpdateUserProfile),
    call(watchDeleteUserProfile),
    call(watchLogout),
  ]);
}
