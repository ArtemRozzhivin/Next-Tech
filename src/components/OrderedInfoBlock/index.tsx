import React, { ReactNode } from 'react';

interface IOrderedInfoBlock {
  title: string;
  text: string;
  textExtractor?: (text: string) => string | ReactNode;
}

const OrderedInfoBlock = ({ title, text, textExtractor }: IOrderedInfoBlock) => {
  return (
    <div className='flex flex-col items-start gap-1'>
      <div className='text-gray-500 text-lg'>{title}</div>
      <div>{textExtractor ? textExtractor(text) : text}</div>
    </div>
  );
};

export default OrderedInfoBlock;
