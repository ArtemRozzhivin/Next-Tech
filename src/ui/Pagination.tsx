import { Pagination } from '@mui/material';
import React from 'react';

interface IСustomPagination {
  onChange: (page: number) => void;
  allPages: number;
}

const СustomPagination = ({ allPages, onChange }: IСustomPagination) => {
  return (
    <div>
      <Pagination
        showFirstButton
        showLastButton
        onChange={(e, page) => onChange(page - 1)}
        count={allPages}
        defaultPage={1}
        size='large'
        color='primary'
        shape='rounded'
      />
    </div>
  );
};

export default СustomPagination;
