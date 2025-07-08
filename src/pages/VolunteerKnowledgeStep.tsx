import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../sevices/axios";
import { useAppDispatch } from "../redux/store";
import { setVolunteers } from "../redux/volunteers/volunteerSlice";
import { isAxiosError } from "axios";

type Knowledge = {
  iD_knowledge: number;  // שים לב: השדה עם i קטנה ו-D גדולה
  describtion: string;
};

const VolunteerKnowledgeStep = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [categories, setCategories] = useState<Knowledge[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [volunteerData, setVolunteerData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem("tempVolunteer");
    if (!stored) {
      alert("לא נמצאו נתוני מתנדב");
      navigate("/auth/sign-up");
      return;
    }

    const volunteer = JSON.parse(stored);
    setVolunteerData(volunteer);

    axios
      .get("/KnowledgeCategory")
      .then((res) => {
        console.log("📋 קטגוריות:", res.data);
        setCategories(res.data);
      })
      .catch(() => setErrorMsg("שגיאה בטעינת תחומי ידע"));
  }, [navigate]);

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setErrorMsg("");

    if (!volunteerData || !volunteerData.volunteer_id) {
      setErrorMsg("לא ניתן לזהות את המשתמש");
      return;
    }

    if (selected.length === 0) {
      setErrorMsg("אנא בחר לפחות תחום ידע אחד");
      return;
    }

    const dataToSend = selected.map((id) => ({
      volunteer_id: Number(volunteerData.volunteer_id),
      ID_knowledge: Number(id),
      describtion: "",
    }));

    try {
      await Promise.all(
        dataToSend.map((item) =>
          axios.post("/My_areas_of_knowledge_", item)
        )
      );

      localStorage.setItem("volunteer", JSON.stringify(volunteerData));
      localStorage.removeItem("tempVolunteer");
      dispatch(setVolunteers([volunteerData]));

      navigate("/volunteer-dashboard");
    } catch (err) {
      const msg = isAxiosError(err)
        ? err.response?.data?.message || "שגיאה מהשרת"
        : "שגיאה כללית בהרשמה";
      setErrorMsg(msg);
    }
  };

  return (
    <div style={{ direction: "rtl", padding: "2rem" }}>
      <h2>בחר תחומי ידע</h2>

      {categories.length === 0 ? (
        <p>טוען...</p>
      ) : (
        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "1rem",
          }}
        >
          {categories.map((cat, index) => (
            <label
              key={`cat-${cat.iD_knowledge ?? index}`}
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              <input
                type="checkbox"
                checked={selected.includes(cat.iD_knowledge)}
                onChange={() => toggle(cat.iD_knowledge)}
              />
              {" " + cat.describtion}
            </label>
          ))}
        </div>
      )}

      <button onClick={handleSubmit} style={{ marginTop: "1rem" }}>
        שמור תחומים נבחרים
      </button>

      {errorMsg && (
        <p style={{ color: "red", marginTop: "1rem", fontWeight: "bold" }}>
          {errorMsg}
        </p>
      )}
    </div>
  );
};

export default VolunteerKnowledgeStep;
