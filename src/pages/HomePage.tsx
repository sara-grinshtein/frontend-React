//  import { Link } from "react-router-dom";

// const HomePage = () => {
//   return (
//     <div>
//       <h1>ברוכים הבאים לאפליקציה</h1>
//       <p>
//        <Link to="/auth/login">התחברות</Link>

        
//          {/* <Link to="/auth/sign-up">הרשמה</Link> */}
//       </p>
//     </div>
//   );
// };

// export default HomePage;
 import { Link, useNavigate } from "react-router-dom";
import { getSession, removeSession } from "../auth/auth.utils";
import { useAppDispatch } from "../redux/store";
import { logout } from "../redux/auth/authSlice";

const HomePage = () => {
  const token = getSession();
  const isLoggedIn = !!token;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    removeSession();           // מוחק את הטוקן
    dispatch(logout());        // מעדכן את Redux
    navigate("/auth/login");  // מפנה לדף התחברות
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>ברוכים הבאים לאפליקציה</h1>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
        {!isLoggedIn && <Link to="/auth/login">התחברות</Link>}
        {!isLoggedIn && <Link to="/auth/sign-up">הרשמה</Link>}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              color: "blue",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            התנתקות
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
