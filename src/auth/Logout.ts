// src/auth/logout.ts
import { logout as logoutAction } from "../redux/auth/authSlice";
import { AppDispatch } from "../redux/store";

export const performLogout = (dispatch: AppDispatch) => {
  localStorage.removeItem("token");
  dispatch(logoutAction());
  window.location.href = "/";
};
