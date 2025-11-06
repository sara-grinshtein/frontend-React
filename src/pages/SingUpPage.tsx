import { useNavigate, Link } from "react-router-dom";
import axios from "../sevices/axios";
import { isAxiosError } from "axios";
import { setSession } from "../auth/auth.utils";
import jwtDecode from "jwt-decode";
import { useAppDispatch } from "../redux/store";
import { setHelpeds } from "../redux/helpeds/helpedSlice";
import { setAuth } from "../redux/auth/authSlice";
import { useForm, useWatch } from "react-hook-form";


interface JwtPayload {
  email: string;
  userId: string;
  [key: string]: any;
}

interface FormInputs {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tel: string;
  location: string;
  role: string;
  startTime?: string;
  endTime?: string;
}

const SignUpPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      role: "Volunteer",
    },
  });

  const selectedRole = useWatch({ control, name: "role" });

  const onSubmit = async (data: FormInputs) => {
    const userPayload =
      data.role === "Volunteer"
        ? {
            FirstName: data.firstName,
            LastName: data.lastName,
            Email: data.email,
            Password: data.password,
            Role: data.role,
            Tel: data.tel,
            Location: data.location,
            start_time: data.startTime + ":00",
            end_time: data.endTime + ":00",
          }
        : {
            FirstName: data.firstName,
            LastName: data.lastName,
            Email: data.email,
            Password: data.password,
            Role: data.role,
            Tel: data.tel,
            Location: data.location,
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

      dispatch(setAuth({ email: decoded.email, role: data.role.toLowerCase() }));

      if (data.role === "Volunteer") {
        const volunteer = res.data?.volunteer;
        if (!volunteer) {
          alert("שגיאה: לא חזרו נתוני מתנדב");
          return;
        }

        localStorage.setItem("tempVolunteer", JSON.stringify(volunteer));

        alert("נרשמת בהצלחה! נא לבחור תחומי ידע להשלמת ההרשמה");
        navigate("/volunteer/select-knowledge");
      } else {
        const helped = res.data?.helped;
        if (!helped) {
          alert("שגיאה: לא חזרו נתוני נעזר");
          return;
        }
        dispatch(setHelpeds([helped]));
        localStorage.setItem("helped", JSON.stringify(helped));
        alert("נרשמת בהצלחה");
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ direction: "rtl", padding: "2rem", maxWidth: "600px", margin: "auto" }}
    >
      <h1>הרשמה</h1>

      <div>
        <input
          {...register("firstName", {
            required: "שדה חובה",
            pattern: { value: /^[A-Za-zא-ת\s'-]+$/, message: "יש להזין אותיות בלבד" },
          })}
          placeholder="שם פרטי"
          style={{ border: errors.firstName ? "1px solid red" : undefined }}
        />
        {errors.firstName && <p style={{ color: "red" }}>{errors.firstName.message}</p>}
      </div>

      <div>
        <input
          {...register("lastName", {
            required: "שדה חובה",
            pattern: { value: /^[A-Za-zא-ת\s'-]+$/, message: "יש להזין אותיות בלבד" },
          })}
          placeholder="שם משפחה"
          style={{ border: errors.lastName ? "1px solid red" : undefined }}
        />
        {errors.lastName && <p style={{ color: "red" }}>{errors.lastName.message}</p>}
      </div>

      <div>
        <input
          {...register("email", {
            required: "שדה חובה",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "כתובת אימייל לא תקינה" },
          })}
          type="email"
          placeholder="אימייל"
          style={{ border: errors.email ? "1px solid red" : undefined }}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
      </div>

      <div>
        <input
          {...register("password", {
            required: "שדה חובה",
            minLength: { value: 6, message: "סיסמה חייבת להכיל לפחות 6 תווים" },
          })}
          type="password"
          placeholder="סיסמה"
          style={{ border: errors.password ? "1px solid red" : undefined }}
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
      </div>

      <div>
        <input
          {...register("tel", {
            required: "שדה חובה",
            pattern: { value: /^[0-9]+$/, message: "יש להזין ספרות בלבד" },
          })}
          placeholder="טלפון"
          style={{ border: errors.tel ? "1px solid red" : undefined }}
        />
        {errors.tel && <p style={{ color: "red" }}>{errors.tel.message}</p>}
      </div>

      <div>
        <input
          {...register("location", {
            required: "שדה חובה",
            pattern: { value: /^[A-Za-zא-ת\s'-]+$/, message: "יש להזין אותיות בלבד" },
          })}
          placeholder="מיקום"
          style={{ border: errors.location ? "1px solid red" : undefined }}
        />
        {errors.location && <p style={{ color: "red" }}>{errors.location.message}</p>}
      </div>

      {selectedRole === "Volunteer" && (
        <>
          <div>
            <label>שעת התחלה</label>
            <input
              type="time"
              {...register("startTime", { required: "שדה חובה" })}
              style={{ border: errors.startTime ? "1px solid red" : undefined }}
            />
            {errors.startTime && <p style={{ color: "red" }}>{errors.startTime.message}</p>}
          </div>

          <div>
            <label>שעת סיום</label>
            <input
              type="time"
              {...register("endTime", { required: "שדה חובה" })}
              style={{ border: errors.endTime ? "1px solid red" : undefined }}
            />
            {errors.endTime && <p style={{ color: "red" }}>{errors.endTime.message}</p>}
          </div>
        </>
      )}

      <div>
        <select {...register("role")}>
          <option value="Volunteer">מתנדב</option>
          <option value="Helped">נעזר</option>
        </select>
      </div>

      <button type="submit" style={{ marginTop: "1rem" }}>
        הרשמה
      </button>

      <p style={{ marginTop: "1rem" }}>
        כבר רשום? <Link to="/auth/login">התחבר</Link>
      </p>
    </form>
  );
};

export default SignUpPage;
