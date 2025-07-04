 import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Container, Navbar, NavLinkStyled, MainContent } from "./style";
import { getSession, removeSession } from "../auth/auth.utils";

const MainLayout = () => {
  const navigate = useNavigate();
  const token = getSession();
  const isLoggedIn = !!token;

  const handleLogout = () => {
    removeSession();
    navigate("/"); // מחזיר לדף הבית
  };

  return (
    <Container>
      <Navbar>
        <NavLinkStyled to="/help-request">בקשת עזרה</NavLinkStyled>
        <NavLinkStyled to="/my-messages">השאר תגובה</NavLinkStyled>

        {/* קישורים לפי מצב התחברות */}
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

export default MainLayout;
