import { Route, Routes } from "react-router-dom";
import { AdminRoute } from "./components/AdminRoute";
import { TopNav } from "./components/TopNav";
import { AdminContentPage } from "./pages/admin/AdminContentPage";
import { AdminCreatePageTemp } from "./pages/admin/AdminCreatePageTemp";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { HomePage } from "./pages/public/HomePage";
import { JournalDetailPage } from "./pages/public/JournalDetailPage";
import { SubmissionPage } from "./pages/public/SubmissionPage";

const App = () => {
  return (
    <>
      <TopNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/journals/:slug" element={<JournalDetailPage />} />
        <Route path="/submit" element={<SubmissionPage />} />
        <Route path="/admin/create-temp" element={<AdminCreatePageTemp />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/content"
          element={
            <AdminRoute>
              <AdminContentPage />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
