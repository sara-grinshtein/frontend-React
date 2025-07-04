import axios from "./axios";

const url = 'Login';
type LoginData = {
  email: string;
  password: string;
};


// auth.service.ts
export const login = async (data: { email: string; password: string }) => {
  return await axios.post<{ token: string }>("Login/login", data);
};


