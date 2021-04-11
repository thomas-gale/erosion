import {
  AppBar,
  Box,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React from "react";
import GitHubIcon from "@material-ui/icons/GitHub";
import { config } from "../env/config";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export const TopNav = (): JSX.Element => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
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
