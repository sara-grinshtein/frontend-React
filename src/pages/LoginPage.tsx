import { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, extractToken } from "../sevices/auth.service";
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

    console.log("🚀 Login process started");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password ? "***" : "(empty)");

    try {
      const response = await login({ email, password });

      // Debug log to inspect the actual backend response
      console.log("🔎 Raw login response:", response.data);

      // Extract token in any format (token / Token / result.token / etc.)
      const token = extractToken(response.data);

      console.log("📥 Extracted token:", token);

      if (!token) {
        alert("Login failed: no token returned from server");
        return;
      }

      // Save session and decode the token
      setSession(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const decoded = jwtDecode<JwtPayload>(token);

      console.log("🔓 Decoded token:", JSON.stringify(decoded, null, 2));

      const role =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ]?.toLowerCase();

      console.log("👤 Role from token:", role);

      // Update Redux auth state
      dispatch(
        setAuth({
          email: decoded.email,
          role: role || "",
        })
      );

      // Redirect by role
      if (role === "volunteer") {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log(
              "📌 Current position:",
              JSON.stringify({ lat, lon }, null, 2)
            );

            try {
              console.log("📡 Fetching volunteer data from server...");
              const existing = await axios.get(`/volunteer/${decoded.userId}`);
              console.log(
                "📥 Volunteer found:",
                JSON.stringify(existing.data, null, 2)
              );

              const volunteer = existing.data;

              const updatedData = {
                volunteer_first_name:
                  (decoded as any)["nameid"] ||
                  volunteer.volunteer_first_name,
                email: (decoded as any).email || volunteer.email,
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

              console.log(
                "📦 Data being sent for update:",
                JSON.stringify(updatedData, null, 2)
              );
              console.log("🆔 Volunteer ID:", decoded.userId);

              const updateResponse = await axios.put(
                `/volunteer/${decoded.userId}`,
                updatedData
              );
              console.log(
                "✅ Update succeeded:",
                JSON.stringify(updateResponse.data, null, 2)
              );

              navigate("/volunteer-dashboard");
            } catch (updateErr) {
              console.error("❌ Error updating volunteer:", updateErr);
              navigate("/volunteer-dashboard");
            }
          },
          (err) => {
            console.warn("⚠️ Could not get location:", err);
            navigate("/volunteer-dashboard");
          }
        );
      } else if (role === "helped") {
        navigate("/helped-dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("Login failed — check console for details");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Login Page</h1>
      <input name="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <p>
        Not registered yet? <Link to="/auth/sign-up">Sign up</Link>
      </p>
    </form>
  );
};

export default LoginPage;
