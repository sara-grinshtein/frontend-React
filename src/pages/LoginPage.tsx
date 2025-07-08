import { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../sevices/auth.service";
import { setSession } from "../auth/auth.utils";
import { setAuth } from "../redux/auth/authSlice";
import { useAppDispatch } from "../redux/store";
import jwtDecode from "jwt-decode";

interface JwtPayload {
  email: string;
  [key: string]: any;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = formData.get("email")?.toString().trim().toLowerCase() || "";
    const password = formData.get("password")?.toString().trim() || "";

    console.log("Trying to login with:", { email, password });

    try {
      const response = await login({ email, password });

      const token = response.data?.token;

      if (!token) {
        alert("התחברות נכשלה: טוקן לא חזר מהשרת");
        return;
      }

      setSession(token);

      const decoded = jwtDecode<JwtPayload>(token);
      console.log("Decoded token:", decoded);

      const role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]?.toLowerCase();

      dispatch(
        setAuth({
          email: decoded.email,
          role: role || "",
        })
      );

      if (role === "volunteer") {
        navigate("/volunteer-dashboard");
      } else if (role === "helped") {
        navigate("/helped-dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("שגיאה בהתחברות", error);
      const message =
        (error as any).response?.data?.message ||
        (error as any).response?.data ||
        "שגיאה לא מזוהה";
      alert("שגיאה בהתחברות: " + message);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>login page</h1>
      <input name="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">התחברות</button>
      <p>
        עדיין לא רשום? <Link to="/auth/sign-up">הרשם</Link>
      </p>
    </form>
  );
};

export default LoginPage;