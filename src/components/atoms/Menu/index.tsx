import { Menu as MantineMenu, MenuItemProps, MenuProps } from '@mantine/core';
import React from 'react';

type IProps = MenuProps;

const Menu: React.FC<IProps> = (props) => {
  return (
    <MantineMenu
      styles={{
        item: {
          '&[data-hovered]': {
            background: 'rgba(255, 255, 255, 0.04)',
          },
        },
        dropdown: {
          padding: 16,
          background: '#272A2E',
          width: 252,
        },
      }}
      {...props}
    />
  );
};

export const MenuItem: React.FC<MenuItemProps & { onClick?: () => void }> = (
  props
) => {
  return (
    <MantineMenu.Item
      style={{ color: '#A4A5A8', fontSize: 16, fontWeight: 400, padding: 12 }}
      {...props}
    />
  );
};

Menu.defaultProps = {};

export default Menu;
