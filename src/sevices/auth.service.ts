// src/sevices/auth.service.ts
import axios from "./axios";

// Role used by the backend controller
export type Role = "Volunteer" | "Helped";

export type LoginData = {
  Email: string;
  Password: string;
};

export type RegisterData = {
  // Must match UserLogin DTO on the server (PascalCase keys)
  Role: Role;
  FirstName: string;
  LastName: string;
  Password: string;
  Email: string;
  Tel?: string;
  Latitude?: number;
  Longitude?: number;
  Start_time?: string;  // e.g. "08:00"
  End_time?: string;    // e.g. "16:00"
};

// Login: POST /api/Login/login  -> { token }
export const login = async (data: LoginData) => {
  console.log("Sending login request:", { ...data, Password: "***" });

  try {
    const { data: res } = await axios.post<{ token: string }>(
      `/Login/login`,
      data
    );
    console.log("Login response:", res);
    return res; // { token }
  } catch (error: any) {
    console.error("Login error:", error);
    if (error?.response?.data) {
      console.error("Server error payload:", error.response.data);
    }
    throw error;
  }
};

// Register: POST /api/Login  -> { token, volunteer | helped }
export const register = async (data: RegisterData) => {
  console.log("Sending register request:", { ...data, Password: "***" });

  try {
    const { data: res } = await axios.post<
      { token: string; volunteer?: any; helped?: any }
    >(`/Login`, data);

    console.log("Register response:", res);
    return res; // { token, volunteer? / helped? }
  } catch (error: any) {
    console.error("Register error:", error);
    if (error?.response?.data) {
      console.error("Server error payload:", error.response.data);
    }
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
