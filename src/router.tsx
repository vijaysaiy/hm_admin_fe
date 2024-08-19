import HomePage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import { createBrowserRouter } from "react-router-dom";
import { APP_ROUTES } from "./appRoutes";
import AuthLayout from "./layouts/AuthLayout";
import ErrorBoundary from "./layouts/ErrorBoundary";
import MainLayout from "./layouts/MainLayout";
import Ailments from "./pages/Ailments/Ailments";
import AppointmentFeedback from "./pages/AppointmentFeedbacks";
import AppointmentDetails from "./pages/Appointments/AppointmentDetails";
import AppointmentsPage from "./pages/Appointments/AppointmentsPage";
import DoctorsPage from "./pages/DoctorsPage";
import Medicines from "./pages/Medicines/Medicines";
import NotFoundPage from "./pages/NotFoundPage";
import PatientDetails from "./pages/Patients/PatientDetails";
import PatientsPage from "./pages/Patients/PatientsPage";
import ProfilePage from "./pages/ProfilePage";

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
        path: APP_ROUTES.PATIENT_DETAILS + "/:id",
        element: <PatientDetails />,
      },
      {
        path: APP_ROUTES.USERS,
        element: <DoctorsPage />,
      },
      {
        path: APP_ROUTES.APPOINTMENTS,
        element: <AppointmentsPage />,
      },
      {
        path: APP_ROUTES.APPOINTMENT_DETAILS + "/:id",
        element: <AppointmentDetails />,
      },
      {
        path: APP_ROUTES.MEDICATION,
        element: <Medicines />,
      },
      {
        path: APP_ROUTES.AILMENTS,
        element: <Ailments />,
      },
      {
        path: APP_ROUTES.APPOINTMENT_FEEDBACKS,
        element: <AppointmentFeedback />,
      },
      {
        path: APP_ROUTES.PROFILE,
        element: <ProfilePage />,
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
      /* 404 page */
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
