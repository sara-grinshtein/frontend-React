import { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../sevices/auth.service";
import { setSession } from "../auth/auth.utils";
import { setAuth } from "../redux/auth/authSlice";
import { useAppDispatch } from "../redux/store";
import  jwtDecode  from "jwt-decode";

interface JwtPayload {
  email: string;
  [key: string]: any; // נדרש כדי לאפשר גישה לשדות עם URL כמפתח
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const firstName = formData.get("firstName")?.toString() || "";
    const lastName = formData.get("lastName")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    try {
      const response = await login({
        firstName,
        lastName,
        email,
        password,
      });

      const token = response.data?.token;

      if (!token) {
        alert("התחברות נכשלה: טוקן לא חזר מהשרת");
        return;
      }

      setSession(token);

      const decoded = jwtDecode<JwtPayload>(token);
      console.log("Decoded token:", decoded);

      // שליפת role מהמפתח עם הכתובת
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]?.toLowerCase();
      console.log("role from token:", role);

      dispatch(
        setAuth({
          email: decoded.email,
          role: role || "",
        })
      );

      // ניווט לפי תפקיד
      if (role === "volunteer") {
        navigate("/volunteer-dashboard");
      } else if (role === "helped") {
        navigate("/helped-dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("שגיאה בהתחברות", error);
      alert("שגיאה בהתחברות: " + ((error as any).response?.data || "שגיאה לא מזוהה"));
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>login page</h1>
      <input name="firstName" placeholder="שם פרטי" required />
      <input name="lastName" placeholder="שם משפחה" required />
      <input name="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">התחברות</button>
      <p>
        עדיין לא רשום? <Link to="/auth/sign-up">הרשם</Link>
      </p>
    </form>
  );
};

