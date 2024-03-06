'use client';

import React from 'react';
import cx from 'clsx';

import Button from '@ui/Button';
import GoogleGSVG from '@ui/icons/GoogleGSVG';
import { loginWithGoogle } from '@src/firebaseConfig';
import { useRouter } from 'next/navigation';
import { addUserHistory } from '@src/api/user';

interface IGoogleAuth {
  setIsLoading?: (isLoading: boolean) => void;
  authSSO?: (
    provider: string,
    dontRemember: boolean,
    t: (key: string) => string,
    callback: (res: any) => void,
  ) => void;
  callback?: any;
  dontRemember?: boolean;
  isMiniButton?: boolean;
  className?: string;
}

const GoogleAuth: React.FC<IGoogleAuth> = ({ className }) => {
  const router = useRouter();

  const redirectToMainPage = (user: string) => {
    router.push('/');
    addUserHistory(user);
    console.log(user, 'USER');
  };

  const googleSignin = async () => {
    await loginWithGoogle((user) => redirectToMainPage(user));
  };

  return (
    <Button
      className={cx(
        className,
        'flex items-center justify-center border-indigo-100 dark:text-gray-50 dark:border-slate-700/50 dark:bg-slate-800 dark:hover:bg-slate-700',
      )}
      onClick={googleSignin}
      secondary
      regular>
      <>
        <GoogleGSVG className='w-5 h-5 mr-2' />
        {'auth.common.google'}
      </>
    </Button>
  );
};

export default GoogleAuth;
