 import axios, { AxiosResponse } from "axios";
import { removeSession } from "../auth/auth.utils";

// כתובת בסיס של ה־API
const baseURL =  "http://localhost:5171/api";

// יצירת מופע axios עם baseURL
const axiosInstance = axios.create({ baseURL });

// ✅ Interceptor לבקשות – מוסיף את ה־token לכל בקשה
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
///
// ✅ Interceptor לתשובות – במקרה של 401 מוחק את ה־session
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("🔐 קיבלנו 401 – מסירים session");
      removeSession();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
