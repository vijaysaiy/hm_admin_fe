import HomePage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import { createBrowserRouter } from "react-router-dom";
import { APP_ROUTES } from "./appRoutes";
import AuthLayout from "./layouts/AuthLayout";
import ErrorBoundary from "./layouts/ErrorBoundary";
import MainLayout from "./layouts/MainLayout";
import Admins from "./pages/Admin/Admins";
import CreateAdmin from "./pages/Admin/CreateAdmin";
import UpdateAdmin from "./pages/Admin/UpdateAdmin";
import Ailments from "./pages/Ailments/Ailments";
import AppointmentFeedback from "./pages/AppointmentFeedbacks";
import AppointmentDetails from "./pages/Appointments/AppointmentDetails";
import AppointmentsPage from "./pages/Appointments/AppointmentsPage";
import Medicines from "./pages/Medicines/Medicines";
import NotFoundPage from "./pages/NotFoundPage";
import PatientDetails from "./pages/Patients/PatientDetails";
import PatientsPage from "./pages/Patients/PatientsPage";
import ProfilePage from "./pages/ProfilePage";
import Doctors from "./pages/Doctos/Doctors";
import CreateDoctor from "./pages/Doctos/CreateDoctor";
import UpdateDoctor from "./pages/Doctos/UpdateDoctor";

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
        path: APP_ROUTES.PATIENT_DETAILS,
        element: <PatientDetails />,
      },
      {
        path: APP_ROUTES.ADMINS,
        element: <Admins />,
      },
      {
        path: APP_ROUTES.CREATE_ADMIN,
        element: <CreateAdmin />,
      },
      {
        path: APP_ROUTES.UPDATE_ADMIN,
        element: <UpdateAdmin />,
      },
      {
        path: APP_ROUTES.DOCTORS,
        element: <Doctors />,
      },
      {
        path: APP_ROUTES.CREATE_DOCTOR,
        element: <CreateDoctor />,
      },
      {
        path: APP_ROUTES.UPDATE_DOCTOR,
        element: <UpdateDoctor />,
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
