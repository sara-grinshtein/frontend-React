
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../sevices/axios";

export const SignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "Volunteer", // ברירת מחדל
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
    try {
      const response = await axios.post("/Login", formData); // נשלח לפי מה שהשרת שלך מצפה לו
      alert(response.data);
      navigate("/auth/login");
    } catch (error: any) {
      alert(error.response?.data || "שגיאה בהרשמה");
    }
  };

  return (
    <form onSubmit={onSubmit}>
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
        placeholder="אימייל"
        type="email"
        value={formData.email}
        onChange={onChange}
        required
      />
      <input
        name="password"
        placeholder="סיסמה"
        type="password"
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
        placeholder="מיקום / אזור"
        value={formData.location}
        onChange={onChange}
        required
      />
      <select name="role" value={formData.role} onChange={onChange}>
        <option value="Volunteer">מתנדב</option>
        <option value="Helped">נעזר</option>
      </select>
      <button type="submit">הרשמה</button>
      <p>כבר רשום? <Link to="/auth/login">התחבר</Link></p>
    </form>
  );
};
