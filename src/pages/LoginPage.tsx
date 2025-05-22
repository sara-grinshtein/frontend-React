
import { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../sevices/auth.service";
import { setSession } from "../auth/auth.utils";
import { setAuth } from "../redux/auth/authSlice";;
import { useAppDispatch } from "../redux/store";
const jwt_decode = require("jwt-decode");

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    try {
      const response = await login(email, password);
      const token = response.data.token;

      setSession(token); // שמירה ב-localStorage והגדרת Authorization

      const decoded: any = jwt_decode(token);
      const role = decoded.role;

      dispatch(
        setAuth({
          email: decoded.email,
          role: role,
        })
      );

      // ניתוב לפי תפקיד
      if (role === "Volunteer") {
        navigate("/volunteer-dashboard");
      } else if (role === "Helped") {
        navigate("/helped-dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      alert("שגיאה בהתחברות");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input name="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
      עדיין לא רשום? <Link to="/auth/sign-up">הרשם</Link>
    </form>
  );
};
