import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  firstName: "",
  userName: "",
  lastName: "",
  email: "",
  gender: "",
  profilePicture: "",
  id: "",
  token: null,
  role: "", // Add role to state
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.firstName = action.payload.firstName;
      state.id = action.payload.id;
      state.userName = action.payload.userName;
      state.lastName = action.payload.lastName;
      state.profilePicture = action.payload.profilePicture;
      state.email = action.payload.email;
      state.gender = action.payload.gender;
      state.token = action.payload.token;
      state.role = action.payload.role || ""; // Set role from payload
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.firstName = "";
      state.id = "";
      state.userName = "";
      state.lastName = "";
      state.email = "";
      state.gender = "";
      state.profilePicture = "";
      state.token = null;
      state.role = ""; // Clear role
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
