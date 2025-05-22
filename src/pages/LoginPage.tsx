import { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../sevices/auth.service";
import { setSession } from "../auth/auth.utils";
import { setAuth } from "../redux/auth/authSlice";
import { useAppDispatch } from "../redux/store";
const jwt_decode = require("jwt-decode");

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
    const role = formData.get("role")?.toString() || "";

    try {
      const response = await login({
        firstName,
        lastName,
        email,
        password,
        role
      });

      const token = response.data.token;
      setSession(token);

      const decoded: any = jwt_decode(token);

      dispatch(
        setAuth({
          email: decoded.email,
          role: decoded.role,
        })
      );

      if (decoded.role === "Volunteer") {
        navigate("/volunteer-dashboard");
      } else if (decoded.role === "Helped") {
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
      <input name="firstName" placeholder="שם פרטי" required />
      <input name="lastName" placeholder="שם משפחה" required />
      <input name="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <select name="role" required>
        <option value="">בחר תפקיד</option>
        <option value="Volunteer">מתנדב</option>
        <option value="Helped">נעזר</option>
      </select>
      <button type="submit">התחברות</button>
      עדיין לא רשום? <Link to="/auth/sign-up">הרשם</Link>
    </form>
  );
};
