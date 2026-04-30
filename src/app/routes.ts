import { createBrowserRouter } from "react-router";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { CheckIn } from "./components/CheckIn";
import { InstructorRating } from "./components/InstructorRating";
import { InstructorPanel } from "./components/InstructorPanel";
import { ReceptionPanel } from "./components/ReceptionPanel";
import { WorkoutDetail } from "./components/WorkoutDetail";
import { createProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: createProtectedRoute(Dashboard),
  },
  {
    path: "/workout/:id",
    Component: createProtectedRoute(WorkoutDetail, ['ALUNO']),
  },
  {
    path: "/check-in",
    Component: createProtectedRoute(CheckIn, ['ALUNO']),
  },
  {
    path: "/rate-instructor",
    Component: createProtectedRoute(InstructorRating, ['ALUNO']),
  },
  {
    path: "/instructor",
    Component: createProtectedRoute(InstructorPanel, ['INSTRUTOR']),
  },
  {
    path: "/reception",
    Component: createProtectedRoute(ReceptionPanel, ['RECEPCIONISTA']),
  },
]);
