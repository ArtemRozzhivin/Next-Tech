import React, { memo } from 'react';
import cx from 'clsx';
import _isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

interface IInput {
  label?: string | JSX.Element;
  hint?: string | JSX.Element;
  placeholder?: string;
  type?: string;
  id?: string;
  name?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null | boolean;
  value?: string | number;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const Input = ({
  label,
  hint,
  placeholder,
  type,
  id,
  name,
  className,
  onChange,
  error,
  value,
  disabled,
  onKeyDown,
  onFocus,
  onBlur,
}: IInput): JSX.Element => {
  const identifier = id || name || type;
  const isError = !_isEmpty(error);

  return (
    <div className={className}>
      <div
        className={cx({
          'flex justify-between': label && hint,
        })}>
        <label htmlFor={identifier} className='flex text-sm font-medium text-gray-700'>
          {label}
        </label>
      </div>
      <div
        className={cx('relative', {
          'mt-1': label,
        })}>
        <input
          type={type}
          value={value}
          name={name}
          id={identifier}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          className={cx(
            'p-2 shadow-sm border-2 text-darksecond border-colorMain hover:border-colorSecond rounded-md focus:border-colorSecond block w-full sm:text-sm',
            {
              'border-red-300 text-red-900 placeholder-red-300': isError,
              'cursor-text': disabled,
            },
          )}
          placeholder={placeholder}
          aria-describedby={`${identifier}-optional`}
          disabled={disabled}
        />
        {isError && (
          <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
            <ExclamationCircleIcon className='h-5 w-5 text-red-500' aria-hidden />
          </div>
        )}
      </div>
      {hint && (
        <p className='mt-2 text-sm text-gray-500 whitespace-pre-line' id={`${identifier}-optional`}>
          {hint}
        </p>
      )}
      {isError && (
        <p className='mt-2 text-sm text-red-600' id='email-error'>
          {error}
        </p>
      )}
    </div>
  );
};

export default memo(Input);
