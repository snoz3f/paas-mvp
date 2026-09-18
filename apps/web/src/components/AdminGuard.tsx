import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { trpc } from '@/lib/trpc';
import * as s from './AdminGuard.css';

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { data: me, isLoading, isError } = trpc.auth.getMe.useQuery();

  if (isLoading) {
    return <div className={s.loading}>Checking access…</div>;
  }

  if (isError || !me || me.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
