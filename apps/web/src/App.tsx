import { Routes, Route, Navigate } from 'react-router';
import { LoginPage } from '@/app/auth/LoginPage';
import { RegisterPage } from '@/app/auth/RegisterPage';
import { DashboardLayout } from '@/app/dashboard/DashboardLayout';
import { ProjectsPage } from '@/app/dashboard/projects/ProjectsPage';
import { NewProjectPage } from '@/app/dashboard/projects/NewProjectPage';
import { ProjectPage } from '@/app/dashboard/projects/ProjectPage';
import { DeploymentPage } from '@/app/dashboard/projects/DeploymentPage';
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
        <Route path="projects/:id/deployments/:deploymentId" element={<DeploymentPage />} />
        <Route path="settings" element={<Placeholder title="Settings" />} />
        <Route path="billing" element={<Placeholder title="Billing" />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
