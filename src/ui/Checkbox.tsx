import React, { memo } from 'react';
import cx from 'clsx';
import PropTypes from 'prop-types';

interface ICheckbox {
  label: string | JSX.Element;
  hint?: string | JSX.Element;
  id?: string;
  name?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  hintClassName?: string;
  disabled?: boolean;
  large?: boolean;
}

const Checkbox = ({
  label,
  hint,
  id,
  name,
  className,
  onChange,
  checked,
  hintClassName,
  disabled,
  large,
}: ICheckbox): JSX.Element => {
  const identifier = id || name;

  return (
    <div
      className={cx(
        'relative flex items-start whitespace-pre-line',
        {
          'cursor-not-allowed': disabled,
        },
        className,
      )}>
      <div className='flex items-center h-5'>
        <input
          id={identifier}
          aria-describedby={identifier}
          name={name}
          disabled={disabled}
          type='checkbox'
          checked={checked}
          onChange={onChange}
          className={cx(
            'focus:ring-indigo-500 h-4 w-4 text-colorMain border-gray-300 dark:border-slate-800 dark:bg-slate-700 dark:checked:bg-indigo-600 rounded-md cursor-pointer',
            { '!cursor-not-allowed opacity-50': disabled, 'h-7 w-7': large },
          )}
        />
      </div>
      <div className='ml-3 text-sm'>
        <label
          htmlFor={identifier}
          className={cx('font-medium text-gray-700 dark:text-gray-200 cursor-pointer', {
            '!cursor-not-allowed': disabled,
          })}>
          {label}
        </label>
        {hint && (
          <p
            id={`${identifier}-description`}
            className={cx('text-gray-500 dark:text-gray-300', hintClassName)}>
            {hint}
          </p>
        )}
      </div>
    </div>
  );
};

export default memo(Checkbox);
