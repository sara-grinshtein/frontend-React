// src/sevices/auth.service.ts
import axios from "./axios";

// Server roles
export type Role = "Volunteer" | "Helped";

// Two compatible shapes for login input:
type LoginCamel = { email: string; password: string };
type LoginPascal = { Email: string; Password: string };

// Two compatible shapes for register input:
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

// Normalize login data to the server DTO shape (PascalCase)
function normalizeLoginData(data: LoginCamel | LoginPascal): LoginPascal {
  if ("Email" in data && "Password" in data) return data; // already PascalCase
  const d = data as LoginCamel;
  return { Email: d.email, Password: d.password };
}

// Normalize register data to the server DTO shape (PascalCase)
function normalizeRegisterData(
  data: RegisterCamel | RegisterPascal
): RegisterPascal {
  if ("Role" in data) return data; // already PascalCase
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

// Login: POST /api/Login/login  -> { token }
export const login = async (data: LoginCamel | LoginPascal) => {
  const payload = normalizeLoginData(data);
  console.log("Sending login request:", { ...payload, Password: "***" });

  try {
    const { data: res } = await axios.post<{ token: string }>(
      `/Login/login`,
      payload
    );
    console.log("Login response:", res);
    return res; // { token }
  } catch (error: any) {
    console.error("Login error:", error);
    if (error?.response?.data) console.error("Server error payload:", error.response.data);
    throw error;
  }
};

// Register: POST /api/Login  -> { token, volunteer? | helped? }
export const register = async (data: RegisterCamel | RegisterPascal) => {
  const payload = normalizeRegisterData(data);
  console.log("Sending register request:", { ...payload, Password: "***" });

  try {
    const { data: res } = await axios.post<
      { token: string; volunteer?: any; helped?: any }
    >(`/Login`, payload);

    console.log("Register response:", res);
    return res; // { token, volunteer?/helped? }
  } catch (error: any) {
    console.error("Register error:", error);
    if (error?.response?.data) console.error("Server error payload:", error.response.data);
    throw error;
  }
};



// import axios from "./axios";

// const url = 'Login';

// type LoginData = {
//   email: string;
//   password: string;
// };

// // auth.service.ts
// export const login = async (data: LoginData) => {
//   console.log("שליחת בקשת התחברות עם הנתונים:", data);

//   try {
//     const response = await axios.post<{ token: string }>(`${url}/login`, data);
//     console.log(" קיבלנו תגובה מהשרת:", response.data);
//     return response;
//   } catch (error) {
//     console.error(" שגיאה בבקשת התחברות לשרת:", error);

//     if (typeof error === "object" && error !== null && "response" in error) {
//       const errObj = error as { response?: { data?: any } };
//       console.error("תגובת שגיאה מהשרת:", errObj.response?.data);
//     }

//     throw error;
//   }
// };
