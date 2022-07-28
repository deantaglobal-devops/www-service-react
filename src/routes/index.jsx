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
import { AssetsMainPage } from "../pages/assets/assetsMainPage";
import { GalleryMainPage } from "../pages/gallery/gallery";
import { ProEditorPage } from "../pages/proEditor/proEditor";
import { Users } from "../pages/users/users";
import { LstPage } from "../pages/lst/lst";
import { ConfigurationPanel } from "../pages/configurationPanel/configurationPanel";
import { DownloadAttachment } from "../pages/downloadAttachment/downloadAttachment";
import { PageNotFound } from "../pages/pageNotFound/pageNotFound";
import ArticleView from "../pages/issues/components/articleview/articleView";

export function LanstadRoutes() {
  return (
    <Routes>
      {/* Page Not Found */}
      <Route path="*" element={<PageNotFound />} />
      <Route path="/error" element={<PageNotFound />} />

      {/* Reset password */}
      <Route path="/password-reset/:token" element={<ResetPassword />} />

      {/* Pro-Editor Magic Code */}
      <Route path="/pro-editor/:magicCode" element={<ProEditorPage />} />

      {/* Download Attachment File */}
      <Route path="/download/author" element={<DownloadAttachment />} />
      <Route path="/download/attachment" element={<DownloadAttachment />} />

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
        <Route path="/notification?:project_id" element={<Notification />} />

        {/* Journal Overview */}
        <Route
          path="/project/journal/list/:projectId"
          element={<JournalOverview />}
        />
        {/* Issue Manage */}
        <Route
          path="/project/journal/list/:projectId/issues/:issueId"
          element={<ArticleView />}
        />

        {/* Milestone - books and Journals */}
        <Route path="/project/:projectId" element={<ArticleBookMilestone />} />
        <Route
          path="/project/journal/:projectId/detail/:chapterId"
          element={<ArticleBookMilestone />}
        />

        {/* TOC */}
        <Route path="/project/toc/:projectId" element={<TocMainPage />} />

        {/* Assets */}
        <Route path="/project/assets/:projectId" element={<AssetsMainPage />} />
        <Route
          path="/project/assets/:projectId/detail/:chapterId"
          element={<AssetsMainPage />}
        />

        {/* Gallery */}
        <Route
          path="/project/gallery/:projectId"
          element={<GalleryMainPage />}
        />
        <Route
          path="/project/gallery/:projectId/detail/:chapterId"
          element={<GalleryMainPage />}
        />

        {/* Pro-Editor */}
        <Route path="/vxe/:projectId" element={<ProEditorPage />} />
        <Route
          path="/vxe/:projectId/detail/:chapterId"
          element={<ProEditorPage />}
        />

        {/* Users */}
        <Route path="/project/users/:projectId" element={<Users />} />
        <Route
          path="/project/users/:projectId/detail/:chapterId"
          element={<Users />}
        />

        {/* LST */}
        <Route path="/lst/:projectType" element={<LstPage />} />

        {/* Configuration Panel */}
        <Route path="/configuration/panel" element={<ConfigurationPanel />} />
      </Route>
    </Routes>
  );
}
