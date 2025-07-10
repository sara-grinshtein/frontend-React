 import React from "react";
import { createBrowserRouter, RouterProvider, useParams } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import VolunteerDashboard from "../pages/VolunteerDashboard";
import HelpedDashboard from "../pages/HelpedDashboard";
import HomePage from "../pages/HomePage";
import SignUpPage from "../pages/SingUpPage";
import HelpRequestPage from "../pages/HelpRequestPage";
import Layout from "../layouts/layout";
import SeeMyMassagesHelped from "../pages/seeMyMassagesHelped";
import VolunteerAssignedMessages from "../pages/SeeAssignedMessagesVolunteer";
import VolunteerProfile from "../pages/VolunteerProfile";
import VolunteerKnowledgeStep from "../pages/VolunteerKnowledgeStep";

// רכיב עוטף לפרופיל מתנדב - מקבל volunteerId מה-URL
const VolunteerProfileWithId: React.FC = () => {
  const params = useParams();
  const volunteerId = params.volunteerId ? parseInt(params.volunteerId, 10) : 0;

  if (!volunteerId) return <div>מתנדב לא נמצא</div>;

  return <VolunteerProfile volunteerId={volunteerId} />;
};

// הגדרת הנתיבים
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "home", element: <HomePage /> },
      { path: "auth/login", element: <LoginPage /> },
      { path: "auth/sign-up", element: <SignUpPage /> },
      { path: "help-request", element: <HelpRequestPage /> },
      { path: "volunteer-dashboard", element: <VolunteerDashboard /> },
      { path: "helped-dashboard", element: <HelpedDashboard /> },
      { path: "my-messages", element: <SeeMyMassagesHelped /> },
      { path: "volunteer-my-messages", element: <VolunteerAssignedMessages /> },
      // הנתיב הבא מחייב לכלול volunteerId - אחרת תתקבל שגיאה
      { path: "volunteer/profile/:volunteerId", element: <VolunteerProfileWithId /> },
      { path: "volunteer/select-knowledge", element: <VolunteerKnowledgeStep /> },
    ],
  },
]);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;
