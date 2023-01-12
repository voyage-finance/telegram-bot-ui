import { Divider as MantineDivider, DividerProps } from '@mantine/core';
import React from 'react';

const Divider: React.FC<DividerProps> = (props) => {
  return (
    <MantineDivider
      {...props}
      sx={{
        borderLeftColor: 'rgba(255, 255, 255, 0.08)',
        borderTopColor: 'rgba(255, 255, 255, 0.08) !important',
        ...props.sx,
      }}
    />
  );
};

export default Divider;
