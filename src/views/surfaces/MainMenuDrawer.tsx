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
import React, { useEffect, useState } from 'react';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import { Engine } from '../../engine/Engine';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
});

export interface MainMenuDrawerProps {
  open: boolean;
  onClose: () => void;
  engine: Engine | undefined;
}

export const MainMenuDrawer = (props: MainMenuDrawerProps): JSX.Element => {
  const classes = useStyles();
  const { open, onClose, engine } = props;

  // State values for engine
  const [gravityX, setGravityX] = useState<number>(4);
  const [gravityY, setGravityY] = useState<number>(9.81);

  // Set engine values
  useEffect(() => {
    if (engine) {
      engine.setGravity(gravityX, gravityY);
    }
  }, [engine, gravityX, gravityY]);

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
                  onChange={(event: unknown, newValue: number | number[]) => {
                    setGravityX(newValue as number);
                  }}
                  aria-labelledby="continuous-slider"
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>
          </ListItem>
          <ListItem key={'gravity-y'}>
            <Grid container spacing={4}>
              <Grid item>
                <ListItemText primary={'y'} />
              </Grid>
              <Grid item xs>
                <Slider
                  min={-10.0}
                  max={10.0}
                  step={0.5}
                  value={gravityY}
                  onChange={(event: unknown, newValue: number | number[]) => {
                    setGravityY(newValue as number);
                  }}
                  aria-labelledby="continuous-slider"
                  valueLabelDisplay="auto"
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
