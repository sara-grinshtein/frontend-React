import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../sevices/axios";
import jwt_decode from "jwt-decode";
import { useForm } from "react-hook-form";

type MyToken = {
  userId: number;
  email: string;
  role: string;
  exp: number;
};

type FormValues = {
  title: string;
  phone: string;
  description: string;
};

const HelpRequestPage = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();


  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("חובה להיות מחובר כדי לשלוח בקשה");
    navigate("/auth/login");
    return;
  }

  try {
    const decoded = jwt_decode(token);
    console.log("📦 JWT Decoded:", decoded);
  } catch (err) {
    console.error("שגיאה בפענוח הטוקן:", err);
  }
}, [navigate]);

   const handleLocate = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await res.json();
        setAddress(data.display_name || "כתובת לא זמינה");
      },
      (error) => {
        console.error("שגיאת מיקום:", error);
        alert("לא הצלחנו לזהות את מיקומך.");
      }
    );
  };

  const onSubmit = async (data: FormValues) => {
    if (!address || latitude === null || longitude === null) {
      alert("אנא אתר את מיקומך לפני שליחת הבקשה");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      const decoded = jwt_decode<MyToken>(token);
      const helped_id = decoded.userId;

      const dataToSend = {
        volunteer_id: null,
        helped_id,
        description: data.description,
        isDone: false,
        confirmArrival: false,
        hasResponse: false,
        latitude,
        longitude,
        location: address,
        title: data.title,
        phone: data.phone,
      };

      await axios.post("/message", dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("הבקשה נשלחה בהצלחה");

      // ✅ איפוס שדות
      reset();
      setAddress("");
      setLatitude(null);
      setLongitude(null);

      // ✅ מעבר לדשבורד
      navigate("/helped-dashboard");
    } catch (err) {
      console.error("שגיאה בשליחה:", err);
      alert("אירעה שגיאה בשליחת הבקשה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 600, margin: "0 auto", direction: "rtl" }}>
      <h1>שליחת בקשה לעזרה</h1>

      <label>כותרת הבקשה:</label>
      <input
        {...register("title", { required: "שדה חובה", minLength: { value: 3, message: "לפחות 3 תווים" } })}
        placeholder="לדוגמה: אני צריך סיוע בקניות"
        style={{ width: "100%", padding: "8px", marginBottom: "4px" }}
      />
      {errors.title && <p style={{ color: "red" }}>{errors.title.message}</p>}

      <label>טלפון ליצירת קשר:</label>
      <input
        {...register("phone", {
          required: "שדה חובה",
          pattern: { value: /^05\d([-]?\d{7})$/, message: "מספר לא תקין. פורמט: 050-1234567" },
        })}
        placeholder="050-1234567"
        style={{ width: "100%", padding: "8px", marginBottom: "4px" }}
      />
      {errors.phone && <p style={{ color: "red" }}>{errors.phone.message}</p>}

      <label>תיאור הבקשה:</label>
      <textarea
        {...register("description", {
          required: "שדה חובה",
          minLength: { value: 10, message: "נא להזין לפחות 10 תווים" },
        })}
        placeholder="תאר את הבקשה שלך..."
        style={{ width: "100%", height: "100px", padding: "8px", marginBottom: "4px" }}
      />
      {errors.description && <p style={{ color: "red" }}>{errors.description.message}</p>}

      <label>כתובת שנמצאה:</label>
      <input type="text" value={address} disabled style={{ width: "100%", padding: "8px", marginBottom: "12px" }} />

      <button type="button" onClick={handleLocate} style={{ marginBottom: "16px" }}>
        📍 אתר אותי
      </button>

      <br />
      <button type="submit" disabled={loading}>
        {loading ? "שולח..." : "שלח בקשה"}
      </button>
    </form>
  );
};

export default HelpRequestPage;
