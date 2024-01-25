'use client';

import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import _size from 'lodash/size';
import _keys from 'lodash/keys';
import _omit from 'lodash/omit';
import _isEmpty from 'lodash/isEmpty';

// import GoogleAuth from 'components/GoogleAuth'
// import { withAuthentication, auth } from 'hoc/protected'
import routes from '@src/routes';
import Input from '@ui/Input';
// import Checkbox from 'ui/Checkbox'
// import Tooltip from 'ui/Tooltip'
import Button from '@ui/Button';
import {
  isValidEmail,
  isValidPassword,
  MIN_PASSWORD_CHARS,
  MAX_PASSWORD_CHARS,
} from '@src/utils/validator';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@src/navigation';
import { signup } from '@src/firebaseConfig';
import GoogleAuth from '@src/components/GoogleAuth';

interface ISignupForm {
  email: string;
  password: string;
  repeat: string;
}

const Signup = (): JSX.Element => {
  const t = useTranslations();
  const router = useRouter();
  const [form, setForm] = useState<ISignupForm>({
    email: '',
    password: '',
    repeat: '',
  });
  const [validated, setValidated] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    repeat?: string;
    tos?: string;
  }>({});
  const [beenSubmitted, setBeenSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validate = () => {
    const allErrors = {} as {
      email?: string;
      password?: string;
      repeat?: string;
      tos?: string;
    };

    if (!isValidEmail(form.email)) {
      allErrors.email = t('auth.common.badEmailError');
    }

    if (!isValidPassword(form.password)) {
      allErrors.password = t('auth.common.xCharsError', { amount: MIN_PASSWORD_CHARS });
    }

    if (form.password !== form.repeat || form.repeat === '') {
      allErrors.repeat = t('auth.common.noMatchError');
    }

    if (_size(form.password) > 50) {
      allErrors.password = t('auth.common.passwordTooLong', { amount: MAX_PASSWORD_CHARS });
    }

    const valid = _isEmpty(_keys(allErrors));

    setErrors(allErrors);
    setValidated(valid);
  };

  useEffect(() => {
    validate();
  }, [form]); // eslint-disable-line

  const onSubmit = async (data: ISignupForm) => {
    if (!isLoading) {
      setIsLoading(true);
      try {
        await signup(data.email, data.password);

        router.push('/');
      } catch (error) {
        console.log('ERROR', error);
      }
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    setForm((oldForm) => ({
      ...oldForm,
      [target.name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setBeenSubmitted(true);

    if (validated) {
      onSubmit(form);
    }
  };

  return (
    <div>
      <div className='bg-gray-50 dark:bg-slate-900 flex flex-col py-6 px-4 sm:px-6 lg:px-8'>
        <div className='flex min-h-full flex-1 flex-col justify-center py-6 sm:px-6 lg:px-8'>
          <div className='sm:mx-auto sm:w-full sm:max-w-md'>
            <p className='text-center text-2xl text-gray-900 dark:text-gray-50'>
              {t('auth.signup.title')}
            </p>
          </div>
          <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'>
            <div className='bg-white dark:bg-slate-800/20 dark:ring-1 dark:ring-slate-800 px-6 py-12 shadow sm:rounded-lg sm:px-12'>
              <form className='space-y-6' onSubmit={handleSubmit}>
                <Input
                  name='email'
                  id='email'
                  type='email'
                  label={t('auth.common.email')}
                  value={form.email}
                  onChange={handleInput}
                  error={beenSubmitted ? errors.email : ''}
                />
                <Input
                  name='password'
                  id='password'
                  type='password'
                  label={t('auth.common.password')}
                  hint={t('auth.common.hint', { amount: MIN_PASSWORD_CHARS })}
                  value={form.password}
                  onChange={handleInput}
                  error={beenSubmitted ? errors.password : ''}
                />
                <Input
                  name='repeat'
                  id='repeat'
                  type='password'
                  label={t('auth.common.repeat')}
                  value={form.repeat}
                  onChange={handleInput}
                  error={beenSubmitted ? errors.repeat : ''}
                />
                <Button
                  className='w-full justify-center'
                  type='submit'
                  loading={isLoading}
                  primary
                  giant>
                  {t('auth.signup.button')}
                </Button>
              </form>

              <div>
                <div className='relative mt-10'>
                  <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                    <div className='w-full border-t border-gray-200 dark:border-gray-600' />
                  </div>
                  <div className='relative flex justify-center text-sm font-medium leading-6'>
                    <span className='bg-white dark:bg-slate-800/20 px-6 text-gray-900 dark:text-gray-50'>
                      {t('auth.common.orContinueWith')}
                    </span>
                  </div>
                </div>
                <div className='mt-6 w-full'>
                  <GoogleAuth className='w-full' />
                </div>
              </div>
            </div>

            <p className='mt-10 text-center text-sm text-gray-500 dark:text-gray-200'>
              <span>{t('auth.signup.alreadyAMember')} </span>
              <Link
                href={routes.signin}
                className='font-semibold leading-6 text-colorMain hover:text-colorSecond'
                aria-label={t('titles.signin')}>
                {t('auth.common.signinInstead')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

Signup.propTypes = {
  signup: PropTypes.func.isRequired,
  authSSO: PropTypes.func.isRequired,
  ssrTheme: PropTypes.string.isRequired,
};

export default memo(Signup);
