import { Drawer } from '@material-ui/core';
import React from 'react';

export interface MainMenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const MainMenuDrawer = (props: MainMenuDrawerProps): JSX.Element => {
  const { open, onClose } = props;
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div>Hello Drawer World</div>
    </Drawer>
  );
};
