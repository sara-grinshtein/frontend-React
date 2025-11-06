import axios from "./axios";

const url = 'Login';

type LoginData = {
  email: string;
  password: string;
};

// auth.service.ts
export const login = async (data: LoginData) => {
  console.log("שליחת בקשת התחברות עם הנתונים:", data);

  try {
    const response = await axios.post<{ token: string }>(`${url}/login`, data);
    console.log(" קיבלנו תגובה מהשרת:", response.data);
    return response;
  } catch (error) {
    console.error(" שגיאה בבקשת התחברות לשרת:", error);

    if (typeof error === "object" && error !== null && "response" in error) {
      const errObj = error as { response?: { data?: any } };
      console.error("תגובת שגיאה מהשרת:", errObj.response?.data);
    }

    throw error;
  }
};
