import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { EducationalGuide } from "./pages/EducationalGuide";
import { LessonModule } from "./pages/LessonModule";
import { ReviewModule } from "./pages/ReviewModule";
import { MockExam } from "./pages/MockExam";
import { Analytics } from "./pages/Analytics";
import { Profile } from "./pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/guide",
    Component: EducationalGuide,
  },
  {
    path: "/lesson/:moduleId",
    Component: LessonModule,
  },
  {
    path: "/review/:moduleId",
    Component: ReviewModule,
  },
  {
    path: "/mock-exam",
    Component: MockExam,
  },
  {
    path: "/analytics",
    Component: Analytics,
  },
  {
    path: "/profile",
    Component: Profile,
  },
]);