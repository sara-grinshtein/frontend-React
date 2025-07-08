// לסדר את עריכת פרויל מתנדב לא עובד !!! 
 import React, { useState, useEffect } from "react";
import axios from "../sevices/axios"; // axios מותאם שלך
import type { AxiosResponse } from "axios";

type KnowledgeCategory = {
  iD_knowledge: number;
  describtion: string;
};

type VolunteerDto = {
  volunteer_id: number;
  volunteer_first_name: string;
  volunteer_last_name?: string;
  start_time?: string; // "HH:mm:ss"
  end_time?: string;
  email: string;
  tel?: string;
};

const VolunteerProfile: React.FC<{ volunteerId: number }> = ({ volunteerId }) => {
  const [volunteer, setVolunteer] = useState<VolunteerDto | null>(null);
  const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // טען קטגוריות ידע
    axios.get<KnowledgeCategory[]>("/KnowledgeCategory")
      .then((res: AxiosResponse<KnowledgeCategory[]>) => setCategories(res.data))
      .catch(() => setErrorMessage("שגיאה בטעינת קטגוריות ידע"));

    // טען פרטי מתנדב
    axios.get<VolunteerDto>(`/volunteer/${volunteerId}`)
      .then((res: AxiosResponse<VolunteerDto>) => {
        const data = res.data;
        if (data.start_time && data.start_time.length === 5) data.start_time += ":00";
        if (data.end_time && data.end_time.length === 5) data.end_time += ":00";
        setVolunteer(data);
      })
      .catch(() => setErrorMessage("שגיאה בטעינת פרופיל המתנדב"));

    // טען תחומי ידע של המתנדב
    axios.get<{ iD_knowledge: number }[]>(`/My_areas_of_knowledge/volunteer/${volunteerId}`)
      .then((res: AxiosResponse<{ iD_knowledge: number }[]>) => {
        const ids = Array.from(new Set(res.data.map(item => item.iD_knowledge)));
        setSelectedCategories(ids);
      })
      .catch(() => setErrorMessage("שגיאה בשליפת תחומי ידע של המתנדב"));
  }, [volunteerId]);

  const handleToggleCategory = (id: number) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!volunteer) {
      setErrorMessage("לא נמצא מתנדב לעדכון");
      return;
    }

    try {
      const updatedVolunteer = {
        ...volunteer,
        start_time: volunteer.start_time,
        end_time: volunteer.end_time,
      };

      await axios.put(`/volunteer/${volunteer.volunteer_id}`, updatedVolunteer);
      await axios.delete(`/My_areas_of_knowledge/${volunteer.volunteer_id}`);

      for (const id of selectedCategories) {
        await axios.post("/My_areas_of_knowledge", {
          volunteer_id: volunteer.volunteer_id,
          iD_knowledge: id,
        });
      }

      setSuccessMessage("הפרופיל עודכן בהצלחה ✅");
    } catch (error) {
      console.error("שגיאה בעדכון הפרופיל:", error);
      setErrorMessage("אירעה שגיאה בעדכון הפרופיל");
    }
  };

  if (!volunteer) return <div>טוען נתוני מתנדב...</div>;

  return (
    <div style={{ padding: "2rem", direction: "rtl" }}>
      <h2>עריכת פרופיל מתנדב</h2>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>שם פרטי:</label>
          <input
            type="text"
            value={volunteer.volunteer_first_name}
            onChange={e => setVolunteer({ ...volunteer, volunteer_first_name: e.target.value })}
            required
          />
        </div>

        <div>
          <label>שעת התחלה:</label>
          <input
            type="time"
            value={volunteer.start_time?.slice(0, 5) || ""}
            onChange={e => setVolunteer({ ...volunteer, start_time: e.target.value + ":00" })}
            required
          />
        </div>

        <div>
          <label>שעת סיום:</label>
          <input
            type="time"
            value={volunteer.end_time?.slice(0, 5) || ""}
            onChange={e => setVolunteer({ ...volunteer, end_time: e.target.value + ":00" })}
            required
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>תחומי ידע:</label>
          <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #ccc", padding: 10 }}>
            {categories.map(cat => (
              <label key={cat.iD_knowledge} style={{ display: "block", marginBottom: 5 }}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.iD_knowledge)}
                  onChange={() => handleToggleCategory(cat.iD_knowledge)}
                />
                {" " + cat.describtion}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>שמור</button>
      </form>
    </div>
  );
};

export default VolunteerProfile;
