// src/auth/auth.utils.ts

import axiosInstance from "../sevices/axios";
import { store } from "../redux/store";
import { logout } from "../redux/auth/authSlice";

/**
 * שמירת טוקן בזיכרון וב־axiosInstance
 */
export const setSession = (token: string) => {
  localStorage.setItem("token", token);
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

/**
 * שליפת טוקן מ־localStorage
 */
export const getSession = () => {
  return localStorage.getItem("token");
};

/**
 * הסרת טוקן וניקוי ה־Redux store
 */
export const removeSession = () => {
  localStorage.removeItem("token");
  delete axiosInstance.defaults.headers.common["Authorization"];
  store.dispatch(logout());
};

/**
 * פענוח טוקן JWT ידנית (אם לא משתמשים בספרייה)
 */
export function jwtDecode(token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );
  return JSON.parse(jsonPayload);
}

/**
 * בדיקת תוקף הטוקן
 */
export const isValidToken = (token: string) => {
  if (!token) return false;
  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};
