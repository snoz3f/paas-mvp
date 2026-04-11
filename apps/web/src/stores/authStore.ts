import { create } from 'zustand';

interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload)) as JwtPayload;
  } catch {
    return null;
  }
}

interface AuthState {
  email: string | null;
  userId: string | null;
  init: () => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: null,
  userId: null,

  init: () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const payload = parseJwt(token);
    if (!payload || payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return;
    }
    set({ email: payload.email, userId: payload.sub });
  },

  clear: () => {
    localStorage.removeItem('token');
    set({ email: null, userId: null });
  },
}));
