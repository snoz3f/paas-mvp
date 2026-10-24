import { Routes, Route, Navigate } from 'react-router';
import { LandingPage } from '@/app/landing/LandingPage';
import { LoginPage } from '@/app/auth/LoginPage';
import { RegisterPage } from '@/app/auth/RegisterPage';
import { DashboardLayout } from '@/app/dashboard/DashboardLayout';
import { ProjectsPage } from '@/app/dashboard/projects/ProjectsPage';
import { NewProjectPage } from '@/app/dashboard/projects/NewProjectPage';
import { ProjectPage } from '@/app/dashboard/projects/ProjectPage';
import { AppPage } from '@/app/dashboard/projects/AppPage';
import { DeploymentPage } from '@/app/dashboard/projects/DeploymentPage';
import { NewAppPage } from '@/app/dashboard/projects/NewAppPage';
import { AdminLayout } from '@/app/admin/AdminLayout';
import { AdminOverviewPage } from '@/app/admin/AdminOverviewPage';
import { AdminNodesPage } from '@/app/admin/AdminNodesPage';
import { AuthGuard } from '@/components/AuthGuard';
import { AdminGuard } from '@/components/AdminGuard';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }
      >
        <Route index element={<ProjectsPage />} />
        <Route path="projects/new" element={<NewProjectPage />} />
        <Route path="projects/:id" element={<ProjectPage />}>
          <Route path="apps/new" element={<NewAppPage />} />
          <Route path="apps/:appId" element={<AppPage />} />
        </Route>
        <Route path="projects/:id/apps/:appId/deployments/:deploymentId" element={<DeploymentPage />} />
        <Route path="projects/:id/settings" element={<Navigate to=".." relative="path" replace />} />
        <Route path="settings" element={<Navigate to="/dashboard" replace />} />
        <Route path="billing" element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route
        path="/admin"
        element={
          <AuthGuard>
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          </AuthGuard>
        }
      >
        <Route index element={<AdminOverviewPage />} />
        <Route path="nodes" element={<AdminNodesPage />} />
      </Route>
      <Route path="/" element={<LandingPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
