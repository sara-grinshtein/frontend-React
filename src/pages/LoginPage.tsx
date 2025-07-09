import { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../sevices/auth.service";
import { setSession } from "../auth/auth.utils";
import { setAuth } from "../redux/auth/authSlice";
import { useAppDispatch } from "../redux/store";
import jwtDecode from "jwt-decode";
import axios from "../sevices/axios";

interface JwtPayload {
  email: string;
  userId: number;
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

    console.log("🚀 התחלת התחברות");
    console.log("📧 אימייל:", email);
    console.log("🔑 סיסמה:", password);

    try {
      const response = await login({ email, password });
      const token = response.data?.token;

      console.log("📥 טוקן מהשרת:", token);

      if (!token) {
        alert("התחברות נכשלה: טוקן לא חזר מהשרת");
        return;
      }

      setSession(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const decoded = jwtDecode<JwtPayload>(token);

      console.log("🔓 טוקן מפוענח:", JSON.stringify(decoded, null, 2));

      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]?.toLowerCase();
      console.log("👤 תפקיד מהטוקן:", role);

      dispatch(setAuth({
        email: decoded.email,
        role: role || "",
      }));

      if (role === "volunteer") {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log("📌 מיקום נוכחי:", JSON.stringify({ lat, lon }, null, 2));

            try {
              console.log("📡 ➡️ שליפה של פרטי מתנדב מהשרת...");
              const existing = await axios.get(`/volunteer/${decoded.userId}`);
              console.log("📥 ✅ מתנדב קיים:", JSON.stringify(existing.data, null, 2));

              const volunteer = existing.data;

              const updatedData = {
                volunteer_first_name: decoded["nameid"] || volunteer.volunteer_first_name,
                email: decoded.email || volunteer.email,
                password: password,
                latitude: lat,
                longitude: lon,
                volunteer_last_name: volunteer.volunteer_last_name || "",
                start_time: volunteer.start_time || null,
                end_time: volunteer.end_time || null,
                tel: volunteer.tel || "",
                isDeleted: volunteer.isDeleted || false,
                areas_of_knowledge: volunteer.areas_of_knowledge || [],
                assignment_count: volunteer.assignment_count || 0,
              };

              console.log("📦 נתונים שנשלחים לעדכון:", JSON.stringify(updatedData, null, 2));
              console.log("🆔 volunteer ID:", decoded.userId);

              console.log("📤 שליחת PUT עם volunteer ID:", decoded.userId);
              const updateResponse = await axios.put(`/volunteer/${decoded.userId}`, updatedData);
              console.log("✅ עדכון הצליח:", JSON.stringify(updateResponse.data, null, 2));

              navigate("/volunteer-dashboard");
            } catch (updateErr) {
              console.error("❌ שגיאה בעדכון מתנדב:", updateErr);
            }
          },
          (err) => {
            console.warn("⚠️ לא ניתן לאתר מיקום:", err);
            navigate("/volunteer-dashboard");
          }
        );
      } else if (role === "helped") {
        navigate("/helped-dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("❌ שגיאה בהתחברות:", error);
      alert("שגיאה בהתחברות");
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
