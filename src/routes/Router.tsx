// src/routes/Router.tsx
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import VolunteerDashboard from "../pages/VolunteerDashboard";
import HelpedDashboard from "../pages/HelpedDashboard";
import HomePage from "../pages/HomePage";
import SignUpPage from "../pages/SingUpPage";
import HelpRequestPage from "../pages/HelpRequestPage";
import MainLayout from "../layouts/layout"; 
import SeeMyMassagesHelped from "../pages/seeMyMassagesHelped"; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "auth/login",
        element: <LoginPage />,
      },
      {
        path: "auth/sign-up",
        element: <SignUpPage />,
      },
      {
        path: "help-request",
        element: <HelpRequestPage />,
      },
      {
        path: "volunteer-dashboard",
        element: <VolunteerDashboard />,
      },
      {
        path: "helped-dashboard",
        element: <HelpedDashboard />,
      },
      {
        path: "my-messages", 
        element: <SeeMyMassagesHelped />,
      },
    ],
  },
]);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;
