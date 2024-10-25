import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface LoaderInterface {
    loader: boolean;
    loaderText: string;
    showProgressBar: boolean;
    progress: number;
}

interface ProgressBarPayload {
    showProgressBar: boolean;
    progress: number;
}

const initialState: LoaderInterface = {
    loader: false,
    loaderText: "",
    showProgressBar: false,
    progress: 0,
};

const loaderSlice = createSlice({
    name: "loader",
    initialState,
    reducers: {
        setLoader: (state, action: PayloadAction<any>) => {
            state.loader = action.payload;
        },
        setLoaderText: (state, action: PayloadAction<any>) => {
            state.loaderText = action.payload;
        },
        setProgressBar: (state, action: PayloadAction<ProgressBarPayload>) => {
            state.showProgressBar = action.payload.showProgressBar;
            state.progress = action.payload.progress;
        },
        setProgressPercentage: (state, action: PayloadAction<number>) => {
            state.progress = action.payload;
        },
    },
});

export const {
    setLoader,
    setLoaderText,
    setProgressBar,
    setProgressPercentage,
} = loaderSlice.actions;

export default loaderSlice.reducer;
