 import axios, { AxiosResponse } from "axios";
import { removeSession } from "../auth/auth.utils";

// the base API's adress
//const baseURL = "http://localhost:5171/api";
const baseURL =   process.env.REACT_APP_API_URL?.replace(/\/+$/, "") || "http://localhost:5171";

console.log("API URL:", process.env.REACT_APP_API_URL);

// generate axios instance with baseURL
const axiosInstance = axios.create({ baseURL });

// to inspector request - add the token to each request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// interceptor for responses – in case of 401 deletes the session
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("קיבלנו 401 – מסירים session");
      removeSession();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
