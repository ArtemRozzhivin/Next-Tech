'use client';

import Button from '@src/ui/Button';
import { useRouter } from 'next/navigation';
import React from 'react';

const Categories = () => {
  const router = useRouter();

  const redirectToCategory = (category: string) => {
    router.push(`/${category}`);
  };

  return (
    <div className='p-5 flex justify-center items-center gap-5'>
      <Button onClick={() => redirectToCategory('laptops')} value={'laptops'} secondary giant>
        Laptops
      </Button>
      <Button onClick={() => redirectToCategory('tablets')} value={'tablets'} secondary giant>
        Tablets
      </Button>
      <Button
        onClick={() => redirectToCategory('smartphones')}
        value={'smartphones'}
        secondary
        giant>
        Smartphones
      </Button>
      <Button
        onClick={() => redirectToCategory('smartwatches')}
        value={'smartwatches'}
        secondary
        giant>
        Smartwatches
      </Button>
    </div>
  );
};

export default Categories;
