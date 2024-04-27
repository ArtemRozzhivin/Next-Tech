import routes from '@src/routes';
import Button from '@src/ui/Button';
import Modal from '@src/ui/Modal';
import Link from 'next/link';
import React from 'react';

interface IMustAuthModal {
  isOpen: boolean;
  onClose: (value: boolean) => void;
}

const MustAuthModal = ({ isOpen, onClose }: IMustAuthModal) => {
  return (
    <Modal
      onClose={() => onClose(false)}
      title={'Обліковий запис'}
      type='warning'
      isOpened={isOpen}>
      <div className='flex flex-col items-center gap-2'>
        <div className='text-center text-base md:text-lg'>
          Увійдіть до свого облікового запису для продовження
        </div>
        <Link href={routes.signin}>
          <Button giant primary>
            Увійти
          </Button>
        </Link>
      </div>

      <p className='mt-10 text-center text-sm text-gray-500 dark:text-gray-200'>
        <span>Все ще не зареєстровані на сайті? </span>
        <Link
          href={routes.signup}
          className='font-semibold leading-6 text-colorMain hover:text-colorSecond'>
          Зареєструватись
        </Link>
      </p>
    </Modal>
  );
};

export default MustAuthModal;
