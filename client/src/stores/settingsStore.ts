import { create } from 'zustand';
import { Settings } from '@shared/schema';

interface SettingsState {
  settings: {
    startWithSystem: boolean;
    enableNotifications: boolean;
  };
  isLoading: boolean;
  error: string | null;
  getSettings: () => Promise<void>;
  updateSetting: (key: 'startWithSystem' | 'enableNotifications', value: boolean) => void;
}

// Default settings
const defaultSettings = {
  startWithSystem: true,
  enableNotifications: true
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: defaultSettings,
  isLoading: false,
  error: null,

  getSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      // Load settings from localStorage or use default
      const storedSettings = localStorage.getItem('settings');
      const settings = storedSettings ? JSON.parse(storedSettings) : defaultSettings;
      
      set({ settings });
    } catch (error) {
      set({ error: 'Error loading settings' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSetting: (key, value) => {
    const { settings } = get();
    
    // Update the specific setting
    const updatedSettings = {
      ...settings,
      [key]: value
    };
    
    // Update state
    set({ settings: updatedSettings });
    
    // Save to localStorage
    localStorage.setItem('settings', JSON.stringify(updatedSettings));
  }
}));
