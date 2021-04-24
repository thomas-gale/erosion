import {
  AppBar,
  Box,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import React from 'react';
import GitHubIcon from '@material-ui/icons/GitHub';
import { config } from '../../env/config';
import MenuIcon from '@material-ui/icons/Menu';

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

export interface TopNavProps {
  menuClicked: () => void;
}

export const TopNav = (props: TopNavProps): JSX.Element => {
  const classes = useStyles();
  const { menuClicked } = props;

  return (
    <Box className={classes.container}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="main menu"
            onClick={menuClicked}
          >
            <MenuIcon />
          </IconButton>
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
