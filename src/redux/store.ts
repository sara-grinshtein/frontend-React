// src/redux/store.ts
 
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
// import authReducer from "../auth/auth.utils"; 
import authReducer from "./auth/authSlice";
// יצירת ה־store
export const store = configureStore({
  reducer: {
    auth: authReducer, // הוספת ה־slice של האימות
  },
});

// טיפוסים ל־Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export const useAppDispatch: () => AppDispatch = useDispatch;
