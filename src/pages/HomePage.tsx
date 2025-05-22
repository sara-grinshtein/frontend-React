 import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1>ברוכים הבאים לאפליקציה</h1>
      <p>
       <Link to="/auth/login">התחברות</Link>

        
         {/* <Link to="/auth/sign-up">הרשמה</Link> */}
      </p>
    </div>
  );
};

export default HomePage;
