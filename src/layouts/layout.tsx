import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Container, Navbar, NavLinkStyled, MainContent } from "./style";

const MainLayout = () => {
  return (
    <Container>
      <Navbar>
        <NavLinkStyled to="/help-request">בקשת עזרה</NavLinkStyled>
        <NavLinkStyled to="/my-messages">השאר תגובה</NavLinkStyled>
        {/* בעתיד תוסיף כאן קישורים נוספים */}
      </Navbar>

      <MainContent>
        <Outlet />
      </MainContent>
    </Container>
  );
};

export default MainLayout;
