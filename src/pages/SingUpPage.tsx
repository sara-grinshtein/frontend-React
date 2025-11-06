// src/pages/SingUpPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register, Role } from "../sevices/auth.service";

type FormState = {
  role: Role;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tel?: string;
  latitude?: number;
  longitude?: number;
  start_time?: string;
  end_time?: string;
};

const initialState: FormState = {
  role: "Volunteer",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  tel: "",
  latitude: undefined,
  longitude: undefined,
  start_time: "",
  end_time: "",
};

const SingUpPage: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        e.target.type === "number" ? Number(e.target.value) : e.target.value;
      setForm((prev) => ({ ...prev, [key]: value as any }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      alert("Please fill first name, last name, email and password.");
      return;
    }

    setLoading(true);
    try {
      // 1) Register (server returns token on success)
      const regRes = await register({
        role: form.role,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password,
        email: form.email,
        tel: form.tel,
        latitude: form.latitude,
        longitude: form.longitude,
        start_time: form.start_time,
        end_time: form.end_time,
      });

      let token = regRes?.token;

      // 2) Fallback login if token not returned from register
      if (!token) {
        const loginRes = await login({ email: form.email, password: form.password });
        token = loginRes?.token;
      }

      if (!token) {
        alert("Error: no token returned from server.");
        return;
      }

      localStorage.setItem("token", token);
      alert("Signed up successfully!");
      navigate("/");
    } catch (err: any) {
      console.error("Sign-up/login flow error:", err);
      const serverMsg = err?.response?.data
        ? JSON.stringify(err.response.data)
        : err?.message;
      alert("Failed to sign up: " + (serverMsg || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto" }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginTop: 8 }}>
          Role:
          <select value={form.role} onChange={onChange("role")}>
            <option value="Volunteer">Volunteer</option>
            <option value="Helped">Helped</option>
          </select>
        </label>

        <label style={{ display: "block", marginTop: 8 }}>
          First name:
          <input type="text" value={form.firstName} onChange={onChange("firstName")} required />
        </label>

        <label style={{ display: "block", marginTop: 8 }}>
          Last name:
          <input type="text" value={form.lastName} onChange={onChange("lastName")} required />
        </label>

        <label style={{ display: "block", marginTop: 8 }}>
          Email:
          <input type="email" value={form.email} onChange={onChange("email")} required />
        </label>

        <label style={{ display: "block", marginTop: 8 }}>
          Password:
          <input type="password" value={form.password} onChange={onChange("password")} required />
        </label>

        <label style={{ display: "block", marginTop: 8 }}>
          Phone (optional):
          <input type="tel" value={form.tel} onChange={onChange("tel")} />
        </label>

        <label style={{ display: "block", marginTop: 8 }}>
          Latitude (optional):
          <input type="number" step="any" value={form.latitude ?? ""} onChange={onChange("latitude")} />
        </label>

        <label style={{ display: "block", marginTop: 8 }}>
          Longitude (optional):
          <input type="number" step="any" value={form.longitude ?? ""} onChange={onChange("longitude")} />
        </label>

        <label style={{ display: "block", marginTop: 8 }}>
          Start time (optional):
          <input type="time" value={form.start_time ?? ""} onChange={onChange("start_time")} />
        </label>

        <label style={{ display: "block", marginTop: 8 }}>
          End time (optional):
          <input type="time" value={form.end_time ?? ""} onChange={onChange("end_time")} />
        </label>

        <button type="submit" disabled={loading} style={{ marginTop: 16 }}>
          {loading ? "Submitting..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SingUpPage;


// import { useNavigate, Link } from "react-router-dom";
// import axios from "../sevices/axios";
// import { isAxiosError } from "axios";
// import { setSession } from "../auth/auth.utils";
// import jwtDecode from "jwt-decode";
// import { useAppDispatch } from "../redux/store";
// import { setHelpeds } from "../redux/helpeds/helpedSlice";
// import { setAuth } from "../redux/auth/authSlice";
// import { useForm, useWatch } from "react-hook-form";


// interface JwtPayload {
//   email: string;
//   userId: string;
//   [key: string]: any;
// }

// interface FormInputs {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   tel: string;
//   location: string;
//   role: string;
//   startTime?: string;
//   endTime?: string;
// }

// const SignUpPage = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<FormInputs>({
//     defaultValues: {
//       role: "Volunteer",
//     },
//   });

//   const selectedRole = useWatch({ control, name: "role" });

//   const onSubmit = async (data: FormInputs) => {
//     const userPayload =
//       data.role === "Volunteer"
//         ? {
//             FirstName: data.firstName,
//             LastName: data.lastName,
//             Email: data.email,
//             Password: data.password,
//             Role: data.role,
//             Tel: data.tel,
//             Location: data.location,
//             start_time: data.startTime + ":00",
//             end_time: data.endTime + ":00",
//           }
//         : {
//             FirstName: data.firstName,
//             LastName: data.lastName,
//             Email: data.email,
//             Password: data.password,
//             Role: data.role,
//             Tel: data.tel,
//             Location: data.location,
//           };

//     try {
//       const res = await axios.post("/Login", userPayload);
//       const token = res.data?.token;

//       if (!token) {
//         alert("שגיאה: לא חזר טוקן מהשרת");
//         return;
//       }

//       setSession(token);
//       const decoded = jwtDecode<JwtPayload>(token);

//       dispatch(setAuth({ email: decoded.email, role: data.role.toLowerCase() }));

//       if (data.role === "Volunteer") {
//         const volunteer = res.data?.volunteer;
//         if (!volunteer) {
//           alert("שגיאה: לא חזרו נתוני מתנדב");
//           return;
//         }

//         localStorage.setItem("tempVolunteer", JSON.stringify(volunteer));

//         alert("נרשמת בהצלחה! נא לבחור תחומי ידע להשלמת ההרשמה");
//         navigate("/volunteer/select-knowledge");
//       } else {
//         const helped = res.data?.helped;
//         if (!helped) {
//           alert("שגיאה: לא חזרו נתוני נעזר");
//           return;
//         }
//         dispatch(setHelpeds([helped]));
//         localStorage.setItem("helped", JSON.stringify(helped));
//         alert("נרשמת בהצלחה");
//         navigate("/helped-dashboard");
//       }
//     } catch (error) {
//       if (isAxiosError(error)) {
//         const msg = error.response?.data;
//         if (typeof msg === "string" && msg.includes("already exists")) {
//           alert("משתמש עם האימייל הזה כבר קיים במערכת");
//         } else {
//           alert("שגיאה: " + (msg?.message || JSON.stringify(msg)));
//         }
//       } else {
//         alert("שגיאה כללית בהרשמה");
//       }
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       style={{ direction: "rtl", padding: "2rem", maxWidth: "600px", margin: "auto" }}
//     >
//       <h1>הרשמה</h1>

//       <div>
//         <input
//           {...register("firstName", {
//             required: "שדה חובה",
//             pattern: { value: /^[A-Za-zא-ת\s'-]+$/, message: "יש להזין אותיות בלבד" },
//           })}
//           placeholder="שם פרטי"
//           style={{ border: errors.firstName ? "1px solid red" : undefined }}
//         />
//         {errors.firstName && <p style={{ color: "red" }}>{errors.firstName.message}</p>}
//       </div>

//       <div>
//         <input
//           {...register("lastName", {
//             required: "שדה חובה",
//             pattern: { value: /^[A-Za-zא-ת\s'-]+$/, message: "יש להזין אותיות בלבד" },
//           })}
//           placeholder="שם משפחה"
//           style={{ border: errors.lastName ? "1px solid red" : undefined }}
//         />
//         {errors.lastName && <p style={{ color: "red" }}>{errors.lastName.message}</p>}
//       </div>

//       <div>
//         <input
//           {...register("email", {
//             required: "שדה חובה",
//             pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "כתובת אימייל לא תקינה" },
//           })}
//           type="email"
//           placeholder="אימייל"
//           style={{ border: errors.email ? "1px solid red" : undefined }}
//         />
//         {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
//       </div>

//       <div>
//         <input
//           {...register("password", {
//             required: "שדה חובה",
//             minLength: { value: 6, message: "סיסמה חייבת להכיל לפחות 6 תווים" },
//           })}
//           type="password"
//           placeholder="סיסמה"
//           style={{ border: errors.password ? "1px solid red" : undefined }}
//         />
//         {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
//       </div>

//       <div>
//         <input
//           {...register("tel", {
//             required: "שדה חובה",
//             pattern: { value: /^[0-9]+$/, message: "יש להזין ספרות בלבד" },
//           })}
//           placeholder="טלפון"
//           style={{ border: errors.tel ? "1px solid red" : undefined }}
//         />
//         {errors.tel && <p style={{ color: "red" }}>{errors.tel.message}</p>}
//       </div>

//       <div>
//         <input
//           {...register("location", {
//             required: "שדה חובה",
//             pattern: { value: /^[A-Za-zא-ת\s'-]+$/, message: "יש להזין אותיות בלבד" },
//           })}
//           placeholder="מיקום"
//           style={{ border: errors.location ? "1px solid red" : undefined }}
//         />
//         {errors.location && <p style={{ color: "red" }}>{errors.location.message}</p>}
//       </div>

//       {selectedRole === "Volunteer" && (
//         <>
//           <div>
//             <label>שעת התחלה</label>
//             <input
//               type="time"
//               {...register("startTime", { required: "שדה חובה" })}
//               style={{ border: errors.startTime ? "1px solid red" : undefined }}
//             />
//             {errors.startTime && <p style={{ color: "red" }}>{errors.startTime.message}</p>}
//           </div>

//           <div>
//             <label>שעת סיום</label>
//             <input
//               type="time"
//               {...register("endTime", { required: "שדה חובה" })}
//               style={{ border: errors.endTime ? "1px solid red" : undefined }}
//             />
//             {errors.endTime && <p style={{ color: "red" }}>{errors.endTime.message}</p>}
//           </div>
//         </>
//       )}

//       <div>
//         <select {...register("role")}>
//           <option value="Volunteer">מתנדב</option>
//           <option value="Helped">נעזר</option>
//         </select>
//       </div>

//       <button type="submit" style={{ marginTop: "1rem" }}>
//         הרשמה
//       </button>

//       <p style={{ marginTop: "1rem" }}>
//         כבר רשום? <Link to="/auth/login">התחבר</Link>
//       </p>
//     </form>
//   );
// };

// export default SignUpPage;
