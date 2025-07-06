// src/layouts/layout.tsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Container, Navbar, NavLinkStyled, MainContent } from "./style";
import { getSession, removeSession } from "../auth/auth.utils";
import jwt_decode from "jwt-decode";

const Layout = () => {
  const navigate = useNavigate();
  const token = getSession();
  const isLoggedIn = !!token;

  let userRole = "";

  if (token) {
  try {
    const decoded = jwt_decode<any>(token);
    userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]?.toLowerCase();
  } catch (err) {
    console.error("בעיה בפענוח הטוקן:", err);
    console.log("📛 userRole from token:", userRole);

  }
}


  const handleLogout = () => {
    removeSession();
    navigate("/auth/login"); // לאחר התנתקות - חוזר להתחברות
  };

  return (
    <Container>
      <Navbar>
        {/* ניווט מותאם לפי תפקיד */}
        {userRole === "helped" && (
          <>
            <NavLinkStyled to="/help-request">בקשת עזרה</NavLinkStyled>
            <NavLinkStyled to="/my-messages">הבקשות שלי</NavLinkStyled>
          </>
        )}

        {userRole === "volunteer" && (
          <NavLinkStyled to="/my-messages">בקשות לטיפול</NavLinkStyled>
        )}

        {/* ניווט כללי */}
        {!isLoggedIn ? (
          <>
            <NavLinkStyled to="/auth/login">התחברות</NavLinkStyled>
            <NavLinkStyled to="/auth/sign-up">הרשמה</NavLinkStyled>
          </>
        ) : (
          <button onClick={handleLogout}>התנתקות</button>
        )}
      </Navbar>

      <MainContent>
        <Outlet />
      </MainContent>
    </Container>
  );
};

export default Layout;
