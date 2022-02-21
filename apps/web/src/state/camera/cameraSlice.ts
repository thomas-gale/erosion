import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CameraState {
  generating: boolean;
}

const initialState: CameraState = {
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
