import "./App.css";
import { Engine } from "./engine/Engine";
import { Box, Grid } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TopNav } from "./views/TopNav";

const useStyles = makeStyles((theme) => ({
  "@global": {
    "*::-webkit-scrollbar": {
      width: "0.4em",
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "1px solid slategrey",
    },
  },
  fullScreen: {
    margin: 0,
    height: "100vh",
    width: "100vw",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    pointerEvents: "auto",
  },
  uiOverlay: {
    position: "fixed" /* Sit on top of the page content */,
    top: 0,
    left: 0,
    right: 0,
    pointerEvents: "none",
    height: "100vh",
    maxHeight: "100vh",
  },
  uiPrimaryGridContainer: {
    justify: "flex-start",
  },
  uiPrimaryGridElement: {
    pointerEvents: "auto",
  },
}));

const App = (): JSX.Element => {
  const classes = useStyles();
  return (
    <Box className={classes.fullScreen}>
      <Engine />
      <Box className={classes.uiOverlay}>
        <Grid container className={classes.uiPrimaryGridContainer}>
          <Grid item xs={12}>
            <div className={classes.uiPrimaryGridElement}>
              <TopNav />
            </div>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default App;
