'use client';

import React, { ButtonHTMLAttributes, memo } from 'react';
import cx from 'clsx';

interface IButton
  extends React.DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  text?: string;
  children?: JSX.Element | string;
  primary?: boolean;
  secondary?: boolean;
  danger?: boolean;
  onClick?: () => void;
  white?: boolean;
  small?: boolean;
  regular?: boolean;
  large?: boolean;
  giant?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  loading?: boolean;
  semiSmall?: boolean;
  semiDanger?: boolean;
  focus?: boolean;
  noBorder?: boolean;
  disabled?: boolean;
  gray?: boolean;
}

const Button = ({
  text,
  children,
  primary,
  secondary,
  danger,
  onClick,
  white,
  small,
  regular,
  large,
  giant,
  type,
  className,
  loading,
  semiSmall,
  semiDanger,
  noBorder,
  focus,
  gray,
  disabled,
  ...props
}: IButton): JSX.Element => (
  <button
    {...props}
    disabled={disabled || loading}
    type={type}
    onClick={onClick}
    className={cx(
      'relative inline-flex px-2 py-1 text-center select-none items-center justify-center border leading-4 font-medium rounded-md transition-all duration-300',
      {
        'shadow-sm text-lightmain bg-colorMain hover:bg-colorSecond border-transparent': primary,
        'text-colorMain bg-transparent hover:bg-colorMain hover:text-white border-colorMain':
          secondary,
        'text-gray-700 bg-lightmain hover:bg-lightmain border-transparent': white,
        'text-gray-50 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 border-transparent':
          danger,
        'text-red-500 border-red-600 hover:bg-red-600 hover:text-white dark:text-red-300 dark:hover:text-red-400 dark:border-red-500 border-1':
          semiDanger,
        'focus:border-none hover:bg-stone-400 border-none text-colorMain dark:text-white focus:ring-0 focus:ring-offset-0':
          noBorder,
        'text-gray-700 bg-gray-600 hover:bg-gray-600': gray,
        'px-2.5 py-1.5 text-xs': small,
        'px-2.5 py-1.5 text-sm': semiSmall,
        'px-4 py-2 text-sm': large,
        'px-6 py-3 text-base': giant,
        'px-3 py-2 text-sm': regular,
        'cursor-not-allowed': loading,
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500': focus,
      },
      className,
    )}>
    {text || children}
  </button>
);

export default memo(Button);
