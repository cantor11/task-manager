import { create } from 'zustand';
import { User } from '@shared/schema';

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// Demo user
const demoUser: User = {
  id: 1,
  username: 'demo',
  password: 'demo', // In a real app, passwords would be hashed
  name: 'Juan Pérez',
  avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, check if username/password match the demo user
      // In a real app, this would be a server-side check
      if (username === demoUser.username && password === demoUser.password) {
        // Login successful
        set({ user: demoUser, isAuthenticated: true });
        
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(demoUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      set({ error: 'Invalid credentials' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    // Clear user data
    set({ user: null, isAuthenticated: false });
    
    // Clear from localStorage
    localStorage.removeItem('user');
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      // Check if user is stored in localStorage
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        // User is logged in
        set({ user: JSON.parse(storedUser), isAuthenticated: true });
      } else {
        // No stored user
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  }
}));
