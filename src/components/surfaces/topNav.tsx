import React from "react";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import MenuIcon from "@material-ui/icons/Menu";
import { config } from "../../env/config";

export interface TopNavProps {
  menuClicked: () => void;
}

export const TopNav = (props: TopNavProps) => {
  const { menuClicked } = props;

  return (
    <Box sx={{ padding: 2, flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="main menu"
            onClick={menuClicked}
            sx={{
              marginRight: 2,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {config.topNav.name}
          </Typography>
          <IconButton
            color="inherit"
            aria-label="github"
            href={config.topNav.gitHubURL}
          >
            <GitHubIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
