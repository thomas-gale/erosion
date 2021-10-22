import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import { TopNav } from "./surfaces/topNav";
import { MainMenuDrawer } from "./surfaces/mainMenuDrawer";
import { ErosionCanvas } from "./viewport/erosionCanvas";

const App = () => {
  const [mainMenuOpen, setMainMenuOpen] = useState(false);

  return (
    <Box
      style={{
        margin: 0,
        height: "100vh",
        width: "100vw",
      }}
    >
      <ErosionCanvas />

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
          />
        </Grid>
      </Box>
    </Box>
  );
};

export default App;
