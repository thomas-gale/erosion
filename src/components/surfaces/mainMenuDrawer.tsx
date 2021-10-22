import React from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

export interface MainMenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const MainMenuDrawer = (props: MainMenuDrawerProps) => {
  const { open, onClose } = props;

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box style={{ width: 250 }}>
        <List>
          <ListItem key={"settings-title"}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={"settings"} />
          </ListItem>
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};
