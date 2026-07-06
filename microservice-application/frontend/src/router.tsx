import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { ApplicationsPage } from "./features/applications/ApplicationsPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { TelemetryPage } from "./features/dashboard/TelemetryPage";
import { JobsPage } from "./features/jobs/JobsPage";
import { UsersPage } from "./features/users/UsersPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "utenti", element: <UsersPage /> },
      { path: "offerte", element: <JobsPage /> },
      { path: "candidature", element: <ApplicationsPage /> },
      { path: "telemetria", element: <TelemetryPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
