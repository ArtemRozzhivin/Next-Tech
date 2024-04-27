'use client';

import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import { Dialog, Transition } from '@headlessui/react';
import {
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  UserGroupIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface IModal {
  className?: string;
  type?: 'error' | 'success' | 'info' | 'warning' | 'confirmed';
  title?: string;
  children: React.ReactNode | string;
  isOpened: boolean;
  onClose: () => void;
  closeText?: string;
  size?: 'full' | 'regular' | 'large' | 'medium';
  isBeta?: boolean;
  isLoading?: boolean;
  overflowVisible?: boolean;
}

const Modal = ({
  className,
  type,
  title,
  children,
  isOpened,
  onClose,
  closeText,
  size,
  overflowVisible,
}: IModal): JSX.Element => (
  <Transition.Root show={isOpened} as={Fragment}>
    <Dialog
      as='div'
      className={cx('fixed z-10 inset-0 overflow-y-auto', className)}
      open={isOpened}
      onClose={onClose}
      static>
      <div
        className={cx(
          'flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0',
          {
            'pt-0 px-0 pb-0': size === 'full',
          },
        )}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-opacity-55 transition-opacity' />
        </Transition.Child>

        <span className='hidden sm:inline-block sm:align-middle sm:h-screen' aria-hidden='true'>
          &#8203;
        </span>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          enterTo='opacity-100 translate-y-0 sm:scale-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100 translate-y-0 sm:scale-100'
          leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
          <div
            className={cx(
              'inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:px-5 sm:py-4',
              {
                'sm:max-w-lg sm:w-full': size === 'regular',
                'sm:max-w-2xl sm:w-full': size === 'medium',
                'max-w-5xl w-full': size === 'large',
                'w-full': size === 'full',
                'overflow-visible': overflowVisible,
                'overflow-hidden': !overflowVisible,
              },
            )}>
            <div className='flex flex-col gap-3'>
              {type && (
                <div className='flex gap-2 items-center'>
                  {type === 'success' && (
                    <div className='sm:mr-3 mx-auto flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-green-100 sm:h-12 sm:w-12'>
                      <CheckIcon className='h-6 w-6 text-green-600' aria-hidden='true' />
                    </div>
                  )}
                  {type === 'error' && (
                    <div className='sm:mr-3 mx-auto flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-red-100 sm:h-12 sm:w-12'>
                      <ExclamationTriangleIcon
                        className='h-6 w-6 text-red-600'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                  {type === 'info' && (
                    <div className='sm:mr-3 mx-auto flex-shrink-0 flex items-center text-center justify-center h-8 w-8 rounded-full bg-blue-100 sm:h-12 sm:w-12'>
                      <InformationCircleIcon
                        className='h-4 w-4 sm:h-6 sm:w-6 text-blue-600'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                  {type === 'warning' && (
                    <div className='sm:mr-3 mx-auto flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 sm:h-12 sm:w-12'>
                      <ExclamationTriangleIcon
                        className='h-6 w-6 text-amber-600'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                  {type === 'confirmed' && (
                    <div className='sm:mr-3 mx-auto flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-green-100 sm:h-12 sm:w-12'>
                      <UserGroupIcon className='h-6 w-6 text-green-600' aria-hidden='true' />
                    </div>
                  )}
                  <div className='text-center sm:mt-0 sm:text-left w-full'>
                    {title && (
                      <Dialog.Title
                        as='h3'
                        className={cx(
                          'flex items-center text-sm sm:text-lg leading-6 font-medium text-gray-900 dark:text-gray-50',
                          {
                            'justify-between': !closeText,
                            'justify-center sm:justify-start': closeText,
                          },
                        )}>
                        <div>{title}</div>
                        {!closeText && (
                          <XMarkIcon
                            className='h-6 w-6 cursor-pointer text-gray-700 dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-300'
                            onClick={onClose}
                          />
                        )}
                      </Dialog.Title>
                    )}
                  </div>
                </div>
              )}
              <div className='mt-2 text-sm whitespace-pre-line'>{children}</div>
            </div>
            <div className='flex items-center gap-2 px-4 py-3 sm:px-0 sm:pb-0 sm:flex sm:flex-row-reverse'>
              {closeText && (
                <button
                  type='button'
                  className='mt-3 w-full inline-flex justify-center rounded-md dark:border-none border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-50 dark:border-gray-600 dark:bg-slate-800 dark:hover:border-gray-600 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                  onClick={onClose}>
                  {closeText}
                </button>
              )}
            </div>
          </div>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition.Root>
);

export default memo(Modal);
