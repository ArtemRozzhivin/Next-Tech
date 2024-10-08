'use client';

import React, { useState, useEffect } from 'react';
import _keys from 'lodash/keys';
import _isEmpty from 'lodash/isEmpty';
import { signin } from '@src/firebaseConfig';
import routes from '@src/routes';
import Input from '@ui/Input';
import Button from '@ui/Button';
import { isValidEmail, isValidPassword } from '@src/utils/validator';
import GoogleAuth from '@src/components/GoogleAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ISigninForm {
  email: string;
  password: string;
}

const Signin = () => {
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
      allErrors.email = 'auth.common.badEmailError';
    }

    if (!isValidPassword(form.password)) {
      allErrors.password = 'auth.common.xCharsError';
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
      router.push('/');
      signin(data.email, data.password);
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
          Авторизація
        </h2>
      </div>
      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'>
        <div className='bg-white dark:bg-slate-800/20 dark:ring-1 dark:ring-slate-800 px-6 py-12 shadow sm:rounded-lg sm:px-12'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <Input
              name='email'
              id='email'
              type='email'
              label={'Ел. пошта'}
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
              label={'Пароль'}
              placeholder='********'
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
              {'Увійти'}
            </Button>
          </form>

          <div>
            <div className='relative mt-10'>
              <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                <div className='w-full border-t border-gray-200 dark:border-gray-600' />
              </div>
              <div className='relative flex justify-center text-sm font-medium leading-6'>
                <span className='text-center bg-white dark:bg-slate-800/20 px-6 text-gray-900 dark:text-gray-50'>
                  Або авторизуйтесь за допомогою
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
        <span>Все ще не маєте облікового запису? </span>
        <Link
          href={routes.signup}
          className='font-semibold leading-6 text-colorMain hover:text-colorSecond'
          aria-label={'titles.signup'}>
          {'Зареєструйтесь'}
        </Link>
      </p>
    </div>
  );
};

export default Signin;
