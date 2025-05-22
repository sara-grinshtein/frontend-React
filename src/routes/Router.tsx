import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import VolunteerDashboard from "../pages/VolunteerDashboard";
import HelpedDashboard from "../pages/HelpedDashboard";
import HomePage from "../pages/HomePage";

 const router = createBrowserRouter([
  {
    path: "/home",
    element: <HomePage />
  },
  {
    path: "/auth/login",
    element: <LoginPage />
  },
  {
    path: "/volunteer-dashboard",
    element: <VolunteerDashboard />
  },
  {
    path: "/helped-dashboard",
    element: <HelpedDashboard />
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};


export default Router;
