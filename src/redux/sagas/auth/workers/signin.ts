import { call, put } from 'redux-saga/effects';
import _isObject from 'lodash/isPlainObject';
import _omit from 'lodash/omit';
import { authActions } from '@redux/reducers/auth';
import { errorsActions } from '@redux/reducers/errors';

import sagaActions from '../../actions/index';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@src/firebaseConfig';

export default function* singinWorker({
  payload: { credentials, callback },
}: {
  payload: {
    credentials: {
      email: string;
      password: string;
    };
    callback: (isSuccess: boolean) => void;
  };
}) {
  try {
    let user = null;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        user = user;
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
    yield put(authActions.loginSuccessful(user));
    callback(true);
  } catch (error) {
    // @ts-ignore
    const err = _isObject(error) ? error.message : error;
    yield put(
      errorsActions.loginFailed({
        message: err || 'apiNotifications.somethingWentWrong',
      }),
    );
    callback(false);
  } finally {
    yield put(authActions.finishLoading());
  }
}
