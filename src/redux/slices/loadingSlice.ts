import { createSlice } from '@reduxjs/toolkit';

interface LoadingState {
  isLoading: boolean;
  requestCount: number;
}

const initialState: LoadingState = {
  isLoading: false,
  requestCount: 0,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.requestCount += 1;
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.requestCount = Math.max(0, state.requestCount - 1);
      state.isLoading = state.requestCount > 0;
    },
    resetLoading: (state) => {
      state.requestCount = 0;
      state.isLoading = false;
    },
  },
});

export const { startLoading, stopLoading, resetLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
