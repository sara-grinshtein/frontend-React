import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";

// ראוטר פשוט עם רק דף התחברות
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
