import React, { useEffect, useState } from "react";
import {
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Slider,
} from "@mui/material";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import { Engine } from "../../engine/Engine";
import { config } from "../../env/config";

export interface MainMenuDrawerProps {
  open: boolean;
  onClose: () => void;
  engine: Engine | undefined;
}

export const MainMenuDrawer = (props: MainMenuDrawerProps) => {
  const { open, onClose, engine } = props;

  // State values for engine
  const [gravityX, setGravityX] = useState<number>(
    config.engine.gravity.defaultX
  );
  const [gravityY, setGravityY] = useState<number>(
    config.engine.gravity.defaultY
  );

  // Set engine values
  useEffect(() => {
    if (engine) {
      engine.setGravity(gravityX, gravityY);
    }
  }, [engine, gravityX, gravityY]);

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div style={{ width: 250 }}>
        <List>
          <ListItem key={"gravity-title"}>
            <ListItemIcon>
              <VerticalAlignBottomIcon />
            </ListItemIcon>
            <ListItemText primary={"gravity"} />
          </ListItem>
          <ListItem key={"gravity-x"}>
            <Grid container spacing={4}>
              <Grid item>
                <ListItemText primary={"x"} />
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
          <ListItem key={"gravity-y"}>
            <Grid container spacing={4}>
              <Grid item>
                <ListItemText primary={"y"} />
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
