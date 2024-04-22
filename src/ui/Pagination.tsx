import { Pagination } from '@mui/material';
import React from 'react';

interface IСustomPagination {
  onChange: (page: number) => void;
  allPages: number;
}

const СustomPagination = ({ allPages, onChange }: IСustomPagination) => {
  const size = window.innerWidth < 640 ? 'medium' : 'large';

  return (
    <div>
      <Pagination
        showFirstButton
        showLastButton
        onChange={(e, page) => onChange(page - 1)}
        count={allPages}
        defaultPage={1}
        size={size}
        color='primary'
        shape='rounded'
      />
    </div>
  );
};

export default СustomPagination;
