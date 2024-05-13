import React, { memo } from 'react';
import cx from 'clsx';
import _isEmpty from 'lodash/isEmpty';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface IInput {
  icon?: React.ReactNode;
  clearIcon?: boolean;
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
  onClear?: () => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  isOptional?: boolean;
}

const Input = ({
  label,
  icon,
  clearIcon,
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
  onClear,
  onBlur,
  isOptional,
}: IInput): JSX.Element => {
  const identifier = id || name || type;
  const isError = !_isEmpty(error);

  const handleClear = () => {
    if (onClear) {
      onClear();
    }

    onChange &&
      onChange({ target: { value: '', name: identifier } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div>
      <div
        className={cx({
          'flex justify-between': label && hint,
        })}>
        <label htmlFor={identifier} className='flex gap-1 text-sm font-medium text-gray-700'>
          {label} {isOptional && <span className='text-gray-400'>(опціонально)</span>}
        </label>
      </div>
      <div
        className={cx('relative', {
          'mt-1': label,
        })}>
        <div className='absolute top-1/2 left-3 -translate-y-1/2'>{icon && icon}</div>
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
            'p-3 shadow-sm border-2 text-darkmain border-colorMain hover:border-colorSecond rounded-md focus:border-colorSecond block w-full sm:text-sm',
            {
              'border-red-300 text-red-900 placeholder-red-300': isError,
              'cursor-text': disabled,
              'pl-10': icon,
            },
            className,
          )}
          placeholder={placeholder}
          aria-describedby={`${identifier}-optional`}
          disabled={disabled}
        />
        {value && (
          <button onClick={handleClear} className='absolute top-1/2 right-3 -translate-y-1/2'>
            {clearIcon && <XMarkIcon className='w-5 h-5' />}
          </button>
        )}

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
