'use client';

import React, { useState, useEffect, memo } from 'react';
import _keys from 'lodash/keys';
import _isEmpty from 'lodash/isEmpty';
import _isString from 'lodash/isString';
import { Link, useRouter } from '@src/navigation';
import { signin } from '@src/firebaseConfig';
import routes from '@src/routes';
import Input from '@ui/Input';
import Button from '@ui/Button';
import { isValidEmail, isValidPassword, MIN_PASSWORD_CHARS } from '@src/utils/validator';
import { useTranslations } from 'next-intl';
import GoogleAuth from '@src/components/GoogleAuth';

interface ISigninForm {
  email: string;
  password: string;
}

const Signin = () => {
  const t = useTranslations();
  const router = useRouter();
  const [form, setForm] = useState<ISigninForm>({
    email: '',
    password: '',
  });
  const [validated, setValidated] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [beenSubmitted, setBeenSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validate = () => {
    const allErrors = {} as {
      email?: string;
      password?: string;
    };

    if (!isValidEmail(form.email)) {
      allErrors.email = t('auth.common.badEmailError');
    }

    if (!isValidPassword(form.password)) {
      allErrors.password = t('auth.common.xCharsError', { amount: MIN_PASSWORD_CHARS });
    }

    const valid = _isEmpty(_keys(allErrors));

    setErrors(allErrors);
    setValidated(valid);
  };

  useEffect(() => {
    validate();
  }, [form]); // eslint-disable-line

  const onSubmit = (data: ISigninForm) => {
    if (!isLoading) {
      setIsLoading(true);
      signin(data.email, data.password);
      router.push('/');
    }
  };

  const handleInput = ({ target }: { target: HTMLInputElement }) => {
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
    <div className='bg-gray-50 dark:bg-slate-900 flex flex-col py-6 px-4 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-50'>
          {t('auth.signin.title')}
        </h2>
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
              className='mt-4'
              placeholder='example@gmail.com'
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
              className='mt-4'
              onChange={handleInput}
              error={beenSubmitted ? errors.password : ''}
            />

            <Button
              primary
              giant
              className='w-full justify-center'
              type='submit'
              loading={isLoading}>
              {t('auth.signin.button')}
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
      </div>

      <p className='mt-10 text-center text-sm text-gray-500 dark:text-gray-200'>
        <span>{t('auth.signup.notRegisteredYet')} </span>
        <Link
          href={routes.signup}
          className='font-semibold leading-6 text-colorMain hover:text-colorSecond'
          aria-label={t('titles.signup')}>
          {t('auth.common.signupInstead')}
        </Link>
      </p>
    </div>
  );
};

export default Signin;
