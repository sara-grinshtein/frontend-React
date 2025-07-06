import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from "./auth/authSlice";
import volunteersReducer from "./volunteers/volunteerSlice"; // ✅ הוספה

export const store = configureStore({
  reducer: {
    auth: authReducer,
    volunteers: volunteersReducer, // ✅ חיבור ה־slice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
