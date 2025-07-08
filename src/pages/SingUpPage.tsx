 import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../sevices/axios";
import { isAxiosError } from "axios";
import { setSession } from "../auth/auth.utils";
import jwtDecode from "jwt-decode";
import { useAppDispatch } from "../redux/store";
import { setHelpeds } from "../redux/helpeds/helpedSlice";
import { setAuth } from "../redux/auth/authSlice";

interface JwtPayload {
  email: string;
  userId: string;
  [key: string]: any;
}

const SignUpPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "Volunteer",
    tel: "",
    location: "",
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const userPayload = {
      FirstName: formData.firstName,
      LastName: formData.lastName,
      Email: formData.email,
      Password: formData.password,
      Role: formData.role,
      Tel: formData.tel,
      Location: formData.location,
    };

    try {
      const res = await axios.post("/Login", userPayload);
      const token = res.data?.token;

      if (!token) {
        alert("שגיאה: לא חזר טוקן מהשרת");
        return;
      }

      setSession(token);
      const decoded = jwtDecode<JwtPayload>(token);

      dispatch(
        setAuth({ email: decoded.email, role: formData.role.toLowerCase() })
      );

      if (formData.role === "Volunteer") {
        const volunteer = res.data?.volunteer;
        if (!volunteer) {
          alert("שגיאה: לא חזרו נתוני מתנדב");
          return;
        }

        // שמירת המתנדב זמנית עד לבחירת תחומי ידע
        localStorage.setItem("tempVolunteer", JSON.stringify(volunteer));

        alert("נרשמת בהצלחה! נא לבחור תחומי ידע להשלמת ההרשמה");
        navigate("/volunteer/select-knowledge"); // לוודא שזה הנתיב הנכון

      } else {
        const helped = res.data?.helped;
        if (!helped) {
          alert("שגיאה: לא חזרו נתוני נעזר");
          return;
        }
        dispatch(setHelpeds([helped]));
        localStorage.setItem("helped", JSON.stringify(helped));
        alert("נרשמת בהצלחה ");
        navigate("/helped-dashboard");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const msg = error.response?.data;
        if (typeof msg === "string" && msg.includes("already exists")) {
          alert("משתמש עם האימייל הזה כבר קיים במערכת");
        } else {
          alert("שגיאה: " + (msg?.message || JSON.stringify(msg)));
        }
      } else {
        alert("שגיאה כללית בהרשמה");
      }
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ direction: "rtl", padding: "2rem" }}>
      <h1>הרשמה</h1>

      <input
        name="firstName"
        placeholder="שם פרטי"
        value={formData.firstName}
        onChange={onChange}
        required
      />
      <input
        name="lastName"
        placeholder="שם משפחה"
        value={formData.lastName}
        onChange={onChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="אימייל"
        value={formData.email}
        onChange={onChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="סיסמה"
        value={formData.password}
        onChange={onChange}
        required
      />
      <input
        name="tel"
        placeholder="טלפון"
        value={formData.tel}
        onChange={onChange}
        required
      />
      <input
        name="location"
        placeholder="מיקום"
        value={formData.location}
        onChange={onChange}
        required
      />

      <select name="role" value={formData.role} onChange={onChange}>
        <option value="Volunteer">מתנדב</option>
        <option value="Helped">נעזר</option>
      </select>

      <button type="submit" style={{ marginTop: "1rem" }}>
        הרשמה
      </button>

      <p>
        כבר רשום? <Link to="/auth/login">התחבר</Link>
      </p>
    </form>
  );
};

export default SignUpPage;
