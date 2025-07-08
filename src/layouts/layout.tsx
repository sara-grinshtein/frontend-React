//  // src/layouts/layout.tsx
// import React from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import { Container, Navbar, NavLinkStyled, MainContent } from "./style";
// import { getSession, removeSession } from "../auth/auth.utils";
// import jwt_decode from "jwt-decode";

// const Layout = () => {
//   const navigate = useNavigate();
//   const token = getSession();

//   const isValidToken = token && token !== "undefined" && token.length > 10;
//   const isLoggedIn = !!isValidToken;

//   let userRole = "";

//   if (isValidToken) {
//     try {
//       const decoded = jwt_decode<any>(token);
//       userRole =
//         decoded[
//           "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
//         ]?.toLowerCase();
//     } catch (err) {
//       console.error("❌ בעיה בפענוח הטוקן:", err);
//       removeSession(); // ננקה טוקן לא תקין מה-localStorage
//     }
//   }

//   const handleLogout = () => {
//     removeSession();
//     navigate("/auth/login");
//   };

//   return (
//     <Container>
//       <Navbar>
//         {/* ניווט מותאם לפי תפקיד */}
//         {userRole === "helped" && (
//           <>
//             <NavLinkStyled to="/help-request">בקשת עזרה</NavLinkStyled>
//             <NavLinkStyled to="/my-messages">הבקשות שלי</NavLinkStyled>
//           </>
//         )}

//         {userRole === "volunteer" && (
//           <NavLinkStyled to="/my-messages">בקשות לטיפול</NavLinkStyled>
//         )}

//         {/* ניווט כללי */}
//         {!isLoggedIn ? (
//           <>
//             <NavLinkStyled to="/auth/login">התחברות</NavLinkStyled>
//             <NavLinkStyled to="/auth/sign-up">הרשמה</NavLinkStyled>
//           </>
//         ) : (
//           <button onClick={handleLogout}>התנתקות</button>
//         )}
//       </Navbar>

//       <MainContent>
//         <Outlet />
//       </MainContent>
//     </Container>
//   );
// };

// export default Layout;
  
 // src/layouts/layout.tsx 




 import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Container, Navbar, NavLinkStyled, MainContent } from "./style";
import { getSession, removeSession } from "../auth/auth.utils";
import jwt_decode from "jwt-decode";

const Layout = () => {
  const navigate = useNavigate();
  const token = getSession();

  const isValidToken = typeof token === "string" && token !== "undefined" && token.length > 10;
  const isLoggedIn = !!isValidToken;

  let userRole = "";

  if (isValidToken && typeof token === "string") {
    try {
      const decoded = jwt_decode<any>(token);
      userRole =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]?.toLowerCase();
    } catch (err) {
      console.error("❌ בעיה בפענוח הטוקן:", err);
      removeSession();
    }
  }

  const handleLogout = () => {
    removeSession();
    navigate("/auth/login");
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
          <>
            <NavLinkStyled to="/my-messages">בקשות לטיפול</NavLinkStyled>
            <NavLinkStyled to="/volunteer/profile">עריכת פרופיל</NavLinkStyled>
          </>
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
