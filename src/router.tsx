import HomePage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import { createBrowserRouter } from "react-router-dom";
import { APP_ROUTES } from "./appRoutes";
import AuthLayout from "./layouts/AuthLayout";
import ErrorBoundary from "./layouts/ErrorBoundary";
import MainLayout from "./layouts/MainLayout";
import AppointmentsPage from "./pages/AppointmentsPage";
import DoctorsPage from "./pages/DoctorsPage";
import NotFoundPage from "./pages/NotFoundPage";
import PatientsPage from "./pages/PatientsPage";
import RegisterPage from "./pages/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <ErrorBoundary>
        <MainLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        path: APP_ROUTES.DASHBOARD,
        element: <HomePage />,
      },
      {
        path: APP_ROUTES.PATIENTS,
        element: <PatientsPage />,
      },
      {
        path: APP_ROUTES.USERS,
        element: <DoctorsPage />,
      },
      {
        path: APP_ROUTES.APPOINTMENTS,
        element: <AppointmentsPage />,
      },
      /* 404 page */
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <ErrorBoundary>
        <AuthLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        path: APP_ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: APP_ROUTES.REGISTER,
        element: <RegisterPage />,
      },
      /* 404 page */
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
