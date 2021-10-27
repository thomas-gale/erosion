import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TerrainState {
  generating: boolean;
}

const initialState: TerrainState = {
  generating: false,
};

export const terrainSlice = createSlice({
  name: "terrain",
  initialState,
  reducers: {
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.generating = action.payload;
    },
  },
});

export const { setGenerating } = terrainSlice.actions;
export default terrainSlice.reducer;
