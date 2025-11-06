// src/services/axios.ts
import axios, { AxiosResponse } from "axios";
import { removeSession } from "../auth/auth.utils";

// 1) Define the base API URL and append "/api" to it
const base =
  (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "") || "http://localhost:5171";
const baseURL = `${base}/api`;

// 2) Useful console logs
console.log("Axios baseURL:", baseURL);

// 3) Create an Axios instance
const axiosInstance = axios.create({ baseURL });

// 4) Request interceptor – adds token and logs every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  console.log("→", (config.method || "GET").toUpperCase(), `${config.baseURL}${config.url}`);
  return config;
});

// 5) Response interceptor – handles 401 errors and logs responses
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.log("← ERROR", error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      console.warn("Received 401 – clearing session");
      removeSession();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
