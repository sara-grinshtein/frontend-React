import axios from "./axios";

const url = 'Login';

type LoginData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const login = async (data: LoginData) => {
  return await axios.post<{ token: string }>(`${url}/login`, data);
};
