import { create } from 'zustand';
import type { User as FirebaseUser } from 'firebase/auth';
import { useTaskStore } from './taskStore';
import { User } from '@shared/schema';

type ExtendedUser = FirebaseUser & Partial<User>;

interface UserState {
  user: ExtendedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: ExtendedUser) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: (user) => {
    set({ user, isAuthenticated: true });
    localStorage.setItem('user', JSON.stringify(user));
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('user');
    useTaskStore.getState().clearTasks();
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        set({ user: JSON.parse(storedUser), isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  }
}));
