import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  history: {}, // example of data useage {2025-4-11:1800} 1800 => mean time it use app
};

export const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    incrementTime: (state, action) => {
      const date = action.payload;
      state.history[date] = (state.history[date] || 0) + 1; // زوّد ثانية
    },
  },
});

// Action creators are generated for each case reducer function
export const { incrementTime } = activitySlice.actions;
export default activitySlice.reducer;
