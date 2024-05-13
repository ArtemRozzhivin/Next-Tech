'use client';

import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import _size from 'lodash/size';
import _keys from 'lodash/keys';
import _isEmpty from 'lodash/isEmpty';

import routes from '@src/routes';
import Input from '@ui/Input';
import Button from '@ui/Button';
import { isValidEmail, isValidPassword } from '@src/utils/validator';
import { signup } from '@src/firebaseConfig';
import GoogleAuth from '@src/components/GoogleAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ISignupForm {
  email: string;
  password: string;
  repeat: string;
}

const Signup = (): JSX.Element => {
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
      allErrors.email = 'auth.common.badEmailError';
    }

    if (!isValidPassword(form.password)) {
      allErrors.password = 'auth.common.xCharsError';
    }

    if (form.password !== form.repeat || form.repeat === '') {
      allErrors.repeat = 'auth.common.noMatchError';
    }

    if (_size(form.password) > 50) {
      allErrors.password = 'auth.common.passwordTooLong';
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
        console.log(error, 'ERROR');
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
            <p className='text-center text-2xl text-gray-900 dark:text-gray-50'>Реєстрація</p>
          </div>
          <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'>
            <div className='bg-white dark:bg-slate-800/20 dark:ring-1 dark:ring-slate-800 px-6 py-12 shadow sm:rounded-lg sm:px-12'>
              <form className='space-y-6' onSubmit={handleSubmit}>
                <Input
                  name='email'
                  id='email'
                  type='email'
                  label='Ел. пошта'
                  placeholder='example@gmail.com'
                  value={form.email}
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
                  onChange={handleInput}
                  error={beenSubmitted ? errors.password : ''}
                />
                <Input
                  name='repeat'
                  id='repeat'
                  type='password'
                  label={'Повторіть пароль'}
                  placeholder='********'
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
                  {'Зареєструватись'}
                </Button>
              </form>

              <div>
                <div className='relative mt-10'>
                  <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                    <div className='w-full border-t border-gray-200 dark:border-gray-600' />
                  </div>
                  <div className='relative flex justify-center text-sm font-medium leading-6'>
                    <span className='text-center bg-white px-6 text-gray-900'>
                      Або зареєструйтесь за допомогою
                    </span>
                  </div>
                </div>
                <div className='mt-6 w-full'>
                  <GoogleAuth className='w-full' />
                </div>
              </div>
            </div>

            <p className='mt-10 text-center text-sm text-gray-500'>
              <span>Вже маєте обліковий запис? </span>
              <Link
                href={routes.signin}
                className='font-semibold leading-6 text-colorMain hover:text-colorSecond'>
                Увійдіть
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
