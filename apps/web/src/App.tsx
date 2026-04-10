import { Routes, Route, Navigate } from 'react-router';
import { LoginPage } from '@/app/auth/LoginPage';
import { RegisterPage } from '@/app/auth/RegisterPage';
import { DashboardLayout } from '@/app/dashboard/DashboardLayout';
import { ProjectsPage } from '@/app/dashboard/projects/ProjectsPage';
import { AuthGuard } from '@/components/AuthGuard';

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
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
