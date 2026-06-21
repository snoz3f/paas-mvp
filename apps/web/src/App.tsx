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
import { ProjectSettingsPage } from '@/app/dashboard/projects/ProjectSettingsPage';
import { AdminLayout } from '@/app/admin/AdminLayout';
import { AdminOverviewPage } from '@/app/admin/AdminOverviewPage';
import { AdminNodesPage } from '@/app/admin/AdminNodesPage';
import { AuthGuard } from '@/components/AuthGuard';

function Placeholder({ title }: { title: string }) {
  return <div style={{ padding: 40, color: '#666' }}>{title} — coming soon</div>;
}

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
        <Route path="projects/:id" element={<ProjectPage />} />
        <Route path="projects/:id/apps/new" element={<Navigate to="/dashboard/projects/new" replace />} />
        <Route path="projects/:id/apps/:appId" element={<AppPage />} />
        <Route path="projects/:id/apps/:appId/deployments/:deploymentId" element={<DeploymentPage />} />
        <Route path="projects/:id/settings" element={<ProjectSettingsPage />} />
        <Route path="settings" element={<Placeholder title="Settings" />} />
        <Route path="billing" element={<Placeholder title="Billing" />} />
      </Route>
      <Route
        path="/admin"
        element={
          <AuthGuard>
            <AdminLayout />
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
