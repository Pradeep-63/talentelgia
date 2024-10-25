import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ThemeInterface {
  theme: string;
}

const initialState: ThemeInterface = {
  theme: "light",
};

const loaderSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<any>) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = loaderSlice.actions;

export default loaderSlice.reducer;
