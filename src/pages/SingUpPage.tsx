// src/pages/SingUpPage.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, Role } from "../sevices/auth.service";

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
      // Build payload based on selected role
      const regData =
        form.role === "Volunteer"
          ? {
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
            }
          : {
              role: form.role,
              firstName: form.firstName,
              lastName: form.lastName,
              password: form.password,
              email: form.email,
            };

      // Register only
      await register(regData);

      alert("Registration successful! Please log in.");
      navigate("/auth/login"); // adjust route if needed
    } catch (err: any) {
      console.error("Sign-up error:", err);
      const serverMsg = err?.response?.data
        ? JSON.stringify(err.response.data)
        : err?.message;
      alert("Failed to sign up: " + (serverMsg || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
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

        {form.role === "Volunteer" && (
          <>
            <label style={{ display: "block", marginTop: 8 }}>
              Phone:
              <input type="tel" value={form.tel} onChange={onChange("tel")} />
            </label>

            <label style={{ display: "block", marginTop: 8 }}>
              Latitude:
              <input
                type="number"
                step="any"
                value={form.latitude ?? ""}
                onChange={onChange("latitude")}
              />
            </label>

            <label style={{ display: "block", marginTop: 8 }}>
              Longitude:
              <input
                type="number"
                step="any"
                value={form.longitude ?? ""}
                onChange={onChange("longitude")}
              />
            </label>

            <label style={{ display: "block", marginTop: 8 }}>
              Start time:
              <input type="time" value={form.start_time ?? ""} onChange={onChange("start_time")} />
            </label>

            <label style={{ display: "block", marginTop: 8 }}>
              End time:
              <input type="time" value={form.end_time ?? ""} onChange={onChange("end_time")} />
            </label>
          </>
        )}

        <button type="submit" disabled={loading} style={{ marginTop: 16 }}>
          {loading ? "Submitting..." : "Sign Up"}
        </button>

        <p style={{ marginTop: 12 }}>
          Already have an account? <Link to="/auth/login">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default SingUpPage;
