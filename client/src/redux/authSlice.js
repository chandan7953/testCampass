import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  token: null,
  user: {
    _id: null,
    fullName: "",
    email: "",
    mobile: "",
    role: "student",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;

      state.user = {
        _id: action.payload.user._id,
        fullName: action.payload.user.fullName,
        email: action.payload.user.email,
        mobile: action.payload.user.mobile,
        role: action.payload.user.role,
      };
    },

    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;

      state.user = {
        _id: null,
        fullName: "",
        email: "",
        mobile: "",
        role: "student",
      };
    },
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;

export default authSlice.reducer;