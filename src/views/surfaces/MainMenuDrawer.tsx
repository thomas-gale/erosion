import {
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Slider,
} from '@material-ui/core';
import React, { useState } from 'react';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
});

export interface MainMenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const MainMenuDrawer = (props: MainMenuDrawerProps): JSX.Element => {
  const classes = useStyles();
  const { open, onClose } = props;

  const [gravityX, setGravityX] = useState<number>(4);

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div className={classes.list}>
        <List>
          <ListItem key={'gravity-title'}>
            <ListItemIcon>
              <VerticalAlignBottomIcon />
            </ListItemIcon>
            <ListItemText primary={'gravity'} />
          </ListItem>
          <ListItem key={'gravity-x'}>
            <Grid container spacing={4}>
              <Grid item>
                <ListItemText primary={'x'} />
              </Grid>
              <Grid item xs>
                <Slider
                  min={-10.0}
                  max={10.0}
                  step={0.5}
                  value={gravityX}
                  onChange={(event: unknown, newValue: number | number[]) =>
                    setGravityX(newValue as number)
                  }
                  aria-labelledby="continuous-slider"
                />
              </Grid>
            </Grid>
          </ListItem>
        </List>
        <Divider />
      </div>
    </Drawer>
  );
};
