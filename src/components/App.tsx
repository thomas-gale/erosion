import React, { useState } from "react";
import { Backdrop, Box, CircularProgress, Grid } from "@mui/material";
import { Engine, EngineCanvas } from "../engine/Engine";
import { TopNav } from "./surfaces/TopNav";
import { MainMenuDrawer } from "./surfaces/MainMenuDrawer";

const App = () => {
  const [engine, setEngine] = useState<undefined | Engine>(undefined);
  const [loading, setLoading] = useState(false);
  const [mainMenuOpen, setMainMenuOpen] = useState(false);

  return (
    <Box
      style={{
        margin: 0,
        height: "100vh",
        width: "100vw",
      }}
    >
      <EngineCanvas
        setEngine={setEngine}
        setLoaded={(loaded: boolean) => setLoading(!loaded)}
      />
      <Backdrop
        style={{
          color: "#fff",
          pointerEvents: "auto",
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          pointerEvents: "none",
          height: "100vh",
          maxHeight: "100vh",
        }}
      >
        <Grid container style={{ justifyContent: "flex-start" }}>
          <Grid item xs={12}>
            <div style={{ pointerEvents: "auto" }}>
              <TopNav menuClicked={() => setMainMenuOpen(!mainMenuOpen)} />
            </div>
          </Grid>
          <MainMenuDrawer
            open={mainMenuOpen}
            onClose={() => setMainMenuOpen(false)}
            engine={engine}
          />
        </Grid>
      </Box>
    </Box>
  );
};

export default App;
