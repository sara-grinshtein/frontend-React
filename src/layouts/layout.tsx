import React from "react";
import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div dir="rtl">
      <nav style={{ padding: "1rem", background: "#e0e0e0" }}>
        <Link to="/help-request" style={{ marginLeft: "1rem" }}>בקשת עזרה</Link>
         <Link to="my-messages" style={{ marginLeft: "1rem" }}> השאר תגובה</Link>
        {/* בעתיד תוסיף כאן קישורים נוספים */}
      </nav>

      <main style={{ padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
