// src/pages/VolunteerProfile.tsx
//הקומפוננטה הזאת מאפשרת למתנדב לערוך ולשמור את שעות הפעילות שלו — כלומר, מתי הוא זמין להתנדב.


import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { setVolunteers } from '../redux/volunteers/volunteerSlice';
import axiosInstance from '../sevices/axios';

const VolunteerProfile = () => {
  const dispatch = useDispatch();
  const volunteer = useSelector((state: RootState) => state.volunteers[0]); // נניח שיש רק אחד

  const [startTime, setStartTime] = useState(volunteer?.start_time || '');
  const [endTime, setEndTime] = useState(volunteer?.end_time || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!volunteer) return;

    try {
      const updatedVolunteer = {
        ...volunteer,
        start_time: startTime,
        end_time: endTime,
      };

      await axiosInstance.put(`/volunteer/${volunteer.volunteer_id}`, updatedVolunteer);

      dispatch(setVolunteers([updatedVolunteer]));
      alert('השעות עודכנו בהצלחה ✅');
    } catch (err) {
      console.error('שגיאה בעדכון זמני פעילות:', err);
      alert('אירעה שגיאה בעדכון זמני הפעילות');
    }
  };

  if (!volunteer) return <div>לא נמצאה גישת מתנדב</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>עריכת זמני פעילות</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>שעת התחלה:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>שעת סיום:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">שמור</button>
      </form>
    </div>
  );
};

export default VolunteerProfile;
