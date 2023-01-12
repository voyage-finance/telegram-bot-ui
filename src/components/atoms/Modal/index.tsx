import { Modal as MantineModal, ModalProps } from '@mantine/core';
import React from 'react';
import Text from '../Text';

const Modal: React.FC<ModalProps> = ({ title: _title, ...props }) => {
  const title =
    typeof _title === 'string' ? (
      <Text type="gradient" weight={700}>
        {_title}
      </Text>
    ) : (
      _title
    );
  return (
    <MantineModal
      title={title}
      zIndex={500}
      {...props}
      styles={(theme) => ({
        close: {
          color: 'white',
        },
        modal: {
          background: theme.fn.linearGradient(180, '#333c62', '#25283d'),
          borderRadius: 10,
          width: 484,
        },
      })}
    />
  );
};

export default Modal;
