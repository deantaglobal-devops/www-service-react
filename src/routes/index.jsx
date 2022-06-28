import { Routes, Route } from "react-router-dom";

import { PrivateRoutes } from "./PrivateRoutes";
import { PublicRoutes } from "./PublicRoutes";

import { LoginPage } from "../pages/login/loginPage";
import { ResetPassword } from "../pages/resetPassword/resetPassword";

import { MainDashboard } from "../pages/mainDashboard/mainDashboard";
import { ProjectsDashboard } from "../pages/projectsDashboard/projectsDashboard";
import { JournalOverview } from "../pages/journalOverview/journalOverview";
import { ArticleBookMilestone } from "../pages/articleBookMilestone/articleBookMilestone";

export function LanstadRoutes() {
  return (
    <Routes>
      <Route path="/password-reset/:token" element={<ResetPassword />} />

      <Route element={<PublicRoutes />}>
        <Route path="/" exact element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<PrivateRoutes />}>
        <Route path="/dashboard" element={<MainDashboard />} />
        <Route path="/dashboard/:projectType" element={<ProjectsDashboard />} />

        <Route
          path="/project/journal/list/:projectId"
          element={<JournalOverview />}
        />
        <Route
          path="/project/journal/:projectId/detail/:chapterId"
          element={<ArticleBookMilestone />}
        />
        <Route path="/project/:projectId" element={<ArticleBookMilestone />} />
      </Route>
    </Routes>
  );
}
