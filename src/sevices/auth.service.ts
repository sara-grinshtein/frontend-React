// src/sevices/auth.service.ts
import axios from "./axios";
import type { AxiosResponse } from "axios";

export type Role = "Volunteer" | "Helped";

// ---- Input types ----
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
  start_time?: string;
  end_time?: string;
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

// ---- Normalizers ----
// Convert camelCase objects to PascalCase to match the backend DTO
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

// ---- Token extractor ----
// Extract token safely even if backend returns different key names
export function extractToken(payload: any): string | undefined {
  if (!payload) return undefined;
  if (typeof payload === "string") return payload;
  if (typeof payload?.token === "string") return payload.token;
  if (typeof payload?.Token === "string") return payload.Token;
  if (typeof payload?.result?.token === "string") return payload.result.token;
  if (typeof payload?.data?.token === "string") return payload.data.token;
  return undefined;
}

// ---- API Calls ----

// ✅ Login → POST /Login/login  (token extractor will handle any shape)
export const login = async (
  data: LoginCamel | LoginPascal
): Promise<AxiosResponse<any>> => {
  const payload = normalizeLoginData(data);
  const response = await axios.post(`/Login/login`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

// ✅ Register → POST /Login
export const register = async (
  data: RegisterCamel | RegisterPascal
): Promise<AxiosResponse<any>> => {
  const payload = normalizeRegisterData(data);
  const response = await axios.post(`/Login`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return response;
};
