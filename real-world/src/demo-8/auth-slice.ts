import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";
import { RootState } from "./store";

type AuthState = {
  user?: User;
};

const initialState: AuthState = {};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = undefined;
    },
  },
});

export const { login, logout } = authSlice.actions;

export const authReducer = authSlice.reducer;

// Selectors
export const isLoggedIn = (state: RootState): boolean => !!state.auth.user;
