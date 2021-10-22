import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TerrainState {
  octree: any;
  generating: boolean;
}

const initialState: TerrainState = {
  octree: {},
  generating: false,
};

export const terrainSlice = createSlice({
  name: "terrain",
  initialState,
  reducers: {
    setOctree: (state, action: PayloadAction<any>) => {
      state.octree += action.payload;
    },
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.generating = action.payload;
    },
  },
});

export const { setOctree, setGenerating } = terrainSlice.actions;
export default terrainSlice.reducer;
