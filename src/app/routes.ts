import { createBrowserRouter } from "react-router";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { CheckIn } from "./components/CheckIn";
import { InstructorRating } from "./components/InstructorRating";
import { InstructorPanel } from "./components/InstructorPanel";
import { WorkoutDetail } from "./components/WorkoutDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/workout/:id",
    Component: WorkoutDetail,
  },
  {
    path: "/check-in",
    Component: CheckIn,
  },
  {
    path: "/rate-instructor",
    Component: InstructorRating,
  },
  {
    path: "/instructor",
    Component: InstructorPanel,
  },
]);