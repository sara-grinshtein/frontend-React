import React, { useState } from "react";
import axios from "../sevices/axios"; // ודא שיש לך קובץ axios מוגדר
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

interface MyToken {
  userId: number;
}

const HelpRequestPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");
      const decodedToken = jwt_decode<MyToken>(token);
      console.log(decodedToken); 
      const helped_id = decodedToken.userId;
      console.log("helped id is: "+ helped_id)
      const dataToSend = {
    //  message_id: 0,
        volunteer_id: null, // זהו התיקון הקריטי!
        helped_id: helped_id,
        description: formData.description,
        isDone: false,
        confirmArrival: false
      };

      await axios.post("/message", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("הבקשה נשלחה בהצלחה");
      navigate("/helped-dashboard");
    } catch (error) {
      alert("שגיאה בשליחת הבקשה");
      console.error(error);
    }
  };

  return (
    <div dir="rtl" style={{ padding: "2rem" }}>
      <h2>בקשת עזרה</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="כותרת הבקשה"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <br />
        <textarea
          name="description"
          placeholder="פירוט הבקשה"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="location"
          placeholder="מיקום"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="phone"
          placeholder="טלפון"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">שלח בקשה</button>
      </form>
    </div>
  );
};

export default HelpRequestPage;
