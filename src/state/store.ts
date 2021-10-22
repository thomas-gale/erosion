import { configureStore } from "@reduxjs/toolkit";
import terrainReducer from "./terrain/terrainSlice";

export const store = configureStore({
  reducer: {
    terrain: terrainReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
