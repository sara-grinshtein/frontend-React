import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "../../types/user.types";

interface AuthState {
  user: UserType | null;
  isAuthorized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthorized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
      state.isAuthorized = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthorized = false;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
