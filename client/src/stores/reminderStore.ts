import { create } from 'zustand';
import { Reminder } from '@shared/schema';
import { scheduleNotification } from '@/utils/notifications';

interface ReminderState {
  reminders: Reminder[];
  isLoading: boolean;
  error: string | null;
  getReminders: () => Promise<void>;
  addReminder: (data: Omit<Reminder, 'id'>) => Promise<Reminder>;
  updateReminder: (taskId: number, reminder: Reminder) => Promise<void>;
  deleteReminder: (id: number) => Promise<void>;
  toggleReminder: (taskId: number) => void;
}

// Initial demo reminders
const initialReminders: Reminder[] = [
  { id: 1, taskId: 1, minutesBefore: 60, enabled: true },
  { id: 2, taskId: 2, minutesBefore: 30, enabled: true }
];

export const useReminderStore = create<ReminderState>((set, get) => ({
  reminders: [],
  isLoading: false,
  error: null,

  getReminders: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load reminders from localStorage or use demo reminders
      const storedReminders = localStorage.getItem('reminders');
      const reminders = storedReminders ? JSON.parse(storedReminders) : initialReminders;
      
      set({ reminders });
    } catch (error) {
      set({ error: 'Error loading reminders' });
    } finally {
      set({ isLoading: false });
    }
  },

  addReminder: async (reminderData) => {
    set({ isLoading: true, error: null });
    try {
      // Generate a new id
      const { reminders } = get();
      const newId = reminders.length > 0 ? Math.max(...reminders.map(r => r.id)) + 1 : 1;
      
      // Create new reminder
      const newReminder: Reminder = {
        ...reminderData,
        id: newId
      };
      
      // Update state
      const updatedReminders = [...reminders, newReminder];
      set({ reminders: updatedReminders });
      
      // Save to localStorage
      localStorage.setItem('reminders', JSON.stringify(updatedReminders));
      
      return newReminder;
    } catch (error) {
      set({ error: 'Error adding reminder' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateReminder: async (taskId, updatedReminder) => {
    set({ isLoading: true, error: null });
    try {
      const { reminders } = get();
      
      // Find and update the reminder
      const updatedReminders = reminders.map(reminder => 
        reminder.id === updatedReminder.id ? updatedReminder : reminder
      );
      
      // Update state
      set({ reminders: updatedReminders });
      
      // Save to localStorage
      localStorage.setItem('reminders', JSON.stringify(updatedReminders));
    } catch (error) {
      set({ error: 'Error updating reminder' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteReminder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { reminders } = get();
      
      // Filter out the deleted reminder
      const updatedReminders = reminders.filter(reminder => reminder.id !== id);
      
      // Update state
      set({ reminders: updatedReminders });
      
      // Save to localStorage
      localStorage.setItem('reminders', JSON.stringify(updatedReminders));
    } catch (error) {
      set({ error: 'Error deleting reminder' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleReminder: (taskId) => {
    const { reminders, addReminder, updateReminder } = get();
    const reminderToToggle = reminders.find(r => r.taskId === taskId);
    
    if (reminderToToggle) {
      // Toggle the enabled state
      const updatedReminder = {
        ...reminderToToggle,
        enabled: !reminderToToggle.enabled
      };
      
      updateReminder(taskId, updatedReminder);
    } else {
      // Si no existe un recordatorio para esta tarea, crea uno con estado desactivado por defecto
      addReminder({
        taskId,
        minutesBefore: 30, // Valor por defecto
        enabled: false // Desactivado por defecto
      });
    }
  }
}));
