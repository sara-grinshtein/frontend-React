 export type MessageType = {
  message_id: number;
  volunteer_id: number | null;
  helped_id: number;
  isDone: boolean;
  description: string;
  confirmArrival?: boolean;
  hasResponse: boolean;

  // 🆕 שדות חדשים
  latitude?: number;
  longitude?: number;
  location?: string;     // כתובת אנושית
  title?: string;        // כותרת
  phone?: string;        // טלפון ליצירת קשר
  created_at?: string;   // תאריך יצירת הבקשה
};
