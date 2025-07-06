import React, { useEffect, useState } from "react";
import axiosInstance from "../sevices/axios";
import { MessageType } from "../types/messsage.types";
import jwt_decode from "jwt-decode";

type MyToken = {
  userId: number;
  email: string;
  role: string;
  exp: number;
};

const VolunteerDashboard = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwt_decode<MyToken>(token);
        const userId = decoded.userId;

        const response = await axiosInstance.get("/message", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const unhandled = response.data.filter(
          (m: MessageType) => m.volunteer_id === null && !m.isDone
        );

        setMessages(unhandled);
      } catch (err) {
        console.error("שגיאה בשליפת בקשות:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleConfirmArrival = async (messageId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = jwt_decode<MyToken>(token);
      const volunteerId = decoded.userId;

      await axiosInstance.put(
        `/message/${messageId}`,
        {
          confirmArrival: true,
          volunteer_id: volunteerId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prev) =>
        prev.map((m) =>
          m.message_id === messageId
            ? { ...m, confirmArrival: true, volunteer_id: volunteerId }
            : m
        )
      );
    } catch (err) {
      console.error("שגיאה באישור הגעה:", err);
    }
  };

  if (loading) return <p>טוען בקשות...</p>;

  return (
    <div style={{ direction: "rtl", padding: "2rem" }}>
      <h1>ברוך הבא לדף מתנדב</h1>
      {messages.length === 0 ? (
        <p>אין כרגע בקשות לעזרה</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.message_id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
              background: "#f9f9f9",
            }}
          >
            <p>
              <strong>כותרת:</strong> {msg.title}
            </p>
            <p>
              <strong>תיאור:</strong> {msg.description}
            </p>
            <p>
              <strong>כתובת:</strong> {msg.location}
            </p>

            {msg.confirmArrival ? (
              <>
                <p style={{ color: "green" }}>✅ אישרת הגעה</p>
                {msg.phone && (
                  <p>
                    <strong>טלפון ליצירת קשר:</strong> {msg.phone}
                  </p>
                )}
              </>
            ) : (
              <button onClick={() => handleConfirmArrival(msg.message_id)}>
                אני מגיע
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default VolunteerDashboard;
