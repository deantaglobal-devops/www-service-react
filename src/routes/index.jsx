import { Routes, Route } from "react-router-dom";

import { PrivateRoutes } from "./PrivateRoutes";
import { PublicRoutes } from "./PublicRoutes";

import { LoginPage } from "../pages/login/loginPage";
import { ResetPassword } from "../pages/resetPassword/resetPassword";

import { MainDashboard } from "../pages/mainDashboard/mainDashboard";
import { ProjectsDashboard } from "../pages/projectsDashboard/projectsDashboard";
import { JournalOverview } from "../pages/journalOverview/journalOverview";
import { ArticleBookMilestone } from "../pages/articleBookMilestone/articleBookMilestone";
import { Notification } from "../pages/notificationCenter/notificationCenter";
import { Calendar } from "../pages/calendar/calendar";
import { TocMainPage } from "../pages/toc/tocMainPage";

export function LanstadRoutes() {
  return (
    <Routes>
      {/* Reset password */}
      <Route path="/password-reset/:token" element={<ResetPassword />} />

      <Route element={<PublicRoutes />}>
        {/* Login */}
        <Route path="/" exact element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<PrivateRoutes />}>
        {/* Main Dashboard */}
        <Route path="/dashboard" element={<MainDashboard />} />

        {/* Projects Dashboard */}
        <Route path="/dashboard/:projectType" element={<ProjectsDashboard />} />

        {/* Calendar */}
        <Route path="/calendar" element={<Calendar />} />

        {/* Notification Center */}
        <Route path="/notification" element={<Notification />} />
        <Route path="/notification/:projectId" element={<Notification />} />

        {/* Journal Overview */}
        <Route
          path="/project/journal/list/:projectId"
          element={<JournalOverview />}
        />

        {/* Milestone - books and Journals */}
        <Route path="/project/:projectId" element={<ArticleBookMilestone />} />
        <Route
          path="/project/journal/:projectId/detail/:chapterId"
          element={<ArticleBookMilestone />}
        />

        {/* TOC */}
        <Route path="/project/toc/:projectId" element={<TocMainPage />} />
      </Route>
    </Routes>
  );
}
