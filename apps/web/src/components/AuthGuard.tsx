import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuthStore } from '@/stores/authStore';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const token = localStorage.getItem('token');
  const { userId } = useAuthStore();

  if (!token || !userId) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
