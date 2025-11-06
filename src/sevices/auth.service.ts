// src/sevices/auth.service.ts
import axios from "./axios";
import type { AxiosResponse } from "axios";

export type Role = "Volunteer" | "Helped";

// ---- payloads ----
type LoginCamel = { email: string; password: string };
type LoginPascal = { Email: string; Password: string };

type RegisterCamel = {
  role: Role;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  tel?: string;
  latitude?: number;
  longitude?: number;
  start_time?: string; // "HH:mm"
  end_time?: string;   // "HH:mm"
};

type RegisterPascal = {
  Role: Role;
  FirstName: string;
  LastName: string;
  Password: string;
  Email: string;
  Tel?: string;
  Latitude?: number;
  Longitude?: number;
  Start_time?: string;
  End_time?: string;
};

// ---- helpers ----
function normalizeLoginData(data: LoginCamel | LoginPascal): LoginPascal {
  if ("Email" in data && "Password" in data) return data;
  const d = data as LoginCamel;
  return { Email: d.email, Password: d.password };
}

function normalizeRegisterData(
  data: RegisterCamel | RegisterPascal
): RegisterPascal {
  if ("Role" in data) return data;
  const d = data as RegisterCamel;
  return {
    Role: d.role,
    FirstName: d.firstName,
    LastName: d.lastName,
    Password: d.password,
    Email: d.email,
    Tel: d.tel,
    Latitude: d.latitude,
    Longitude: d.longitude,
    Start_time: d.start_time,
    End_time: d.end_time,
  };
}

// ---- API ----

// ✅ Login → POST /Login/login  (NOT /api/Login/login because baseURL already includes /api)
export const login = async (
  data: LoginCamel | LoginPascal
): Promise<AxiosResponse<{ token: string }>> => {
  const payload = normalizeLoginData(data);
  const response = await axios.post<{ token: string }>(`/Login/login`, payload);
  return response;
};

// ✅ Register → POST /Login  (NOT /api/Login)
export const register = async (
  data: RegisterCamel | RegisterPascal
): Promise<
  AxiosResponse<{ token: string; volunteer?: any; helped?: any }>
> => {
  const payload = normalizeRegisterData(data);
  const response = await axios.post<{ token: string; volunteer?: any; helped?: any }>(
    `/Login`,
    payload
  );
  return response;
};
