import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  role: string;
  franchise: string | null;
  franchiseId: number | null;
  activeFranchiseId?: number | null;
  activeFranchiseName?: string | null;
  staffId: number | null;
  plainPassword?: string;
  accessibleModules?: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  setActiveFranchise: (franchiseId: number, franchiseName: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (userData, token) => set({ 
        user: userData, 
        token, 
        isAuthenticated: true 
      }),
      
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),

      setActiveFranchise: (franchiseId, franchiseName) => set((state) => ({
        user: state.user ? {
          ...state.user,
          activeFranchiseId: franchiseId,
          activeFranchiseName: franchiseName,
          franchiseId: franchiseId,
          franchise: franchiseName
        } : null
      }))
    }),
    {
      name: 'dryft-auth-storage',
    }
  )
);
