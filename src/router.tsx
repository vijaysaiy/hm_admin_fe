import HomePage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import AppointmentsPage from "./pages/AppointmentsPage";
import DoctorsPage from "./pages/DoctorsPage";
import PatientsPage from "./pages/PatientsPage";
import RegisterPage from "./pages/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "dashboard",
        element: <HomePage />,
      },
      {
        path: "patients",
        element: <PatientsPage />,
      },
      {
        path: "doctors",
        element: <DoctorsPage />,
      },
      {
        path: "appointments",
        element: <AppointmentsPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
]);

export default router;
