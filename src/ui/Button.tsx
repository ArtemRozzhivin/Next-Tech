'use client';

/* eslint-disable react/button-has-type */
import React, { ButtonHTMLAttributes, memo } from 'react';
import cx from 'clsx';

// Define the prop types for the component
interface IButton
  extends React.DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  // (string): The text to be displayed in the button.
  text?: string;
  // (node): The content to be displayed in the button.
  children?: JSX.Element | string;
  primary?: boolean;
  secondary?: boolean;
  danger?: boolean;
  // (function): The function to be called when the button is clicked.
  onClick?: () => void;
  white?: boolean;
  small?: boolean;
  regular?: boolean;
  large?: boolean;
  giant?: boolean;
  // (string): The type of button to be rendered.
  type?: 'button' | 'submit' | 'reset';
  // (string): Additional CSS classes to be applied to the button.
  className?: string;
  // (boolean): Whether the button is in a loading state.
  loading?: boolean;
  semiSmall?: boolean;
  semiDanger?: boolean;
  // (boolean): Whether the button is in a focus state.
  focus?: boolean;
  noBorder?: boolean;
  // (boolean): Whether the button is disabled.
  disabled?: boolean;
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
  disabled,
  ...props
}: IButton): JSX.Element => (
  <button
    {...props}
    disabled={disabled || loading}
    type={type}
    onClick={onClick}
    className={cx(
      'w-full relative inline-flex px-2 py-1 text-center select-none items-center justify-center border leading-4 font-medium rounded-md transition-all duration-300',
      {
        'shadow-sm text-lightmain bg-colorMain hover:bg-colorSecond border-transparent': primary,
        'text-colorMain bg-transparent hover:bg-colorMain hover:text-white border-colorMain':
          secondary,
        'text-gray-700 bg-lightsecond hover:bg-lightmain border-transparent': white,
        'text-gray-50 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 border-transparent':
          danger,
        'text-red-500 hover:text-red-600 border-red-600 dark:text-red-300 dark:hover:text-red-400 dark:border-red-500 border-1':
          semiDanger,
        'focus:border-none hover:bg-colorThird border-none text-colorMain dark:text-white focus:ring-0 focus:ring-offset-0':
          noBorder,
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
