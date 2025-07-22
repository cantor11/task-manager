import { Task } from '@shared/schema';
import { useReminderStore } from '@/stores/reminderStore';
import { useSettingsStore } from '@/stores/settingsStore';

// Check if browser supports notifications
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window;
};

// Request permission for notifications
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isNotificationSupported()) {
    console.warn('Notifications are not supported in this browser.');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Send a notification
export const sendNotification = (title: string, options: NotificationOptions = {}): void => {
  if (!isNotificationSupported()) return;
  
  // Check if permission is granted
  if (Notification.permission !== 'granted') {
    requestNotificationPermission();
    return;
  }
  
  try {
    // Create and show notification
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      ...options
    });
    
    // Add click handler to focus the window
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Schedule a notification for a specific task
export const scheduleNotification = (task: Task, minutesBefore: number): void => {
  const { settings } = useSettingsStore.getState();
  
  // Only schedule if notifications are enabled
  if (!settings.enableNotifications) return;
  
  // Calculate when to show the notification
  const taskTime = new Date(task.dueDate).getTime();
  const notificationTime = taskTime - (minutesBefore * 60 * 1000); // Convert minutes to milliseconds
  const now = Date.now();
  
  // Only schedule future notifications
  if (notificationTime > now) {
    const timeoutId = setTimeout(() => {
      sendNotification(`Recordatorio: ${task.title}`, {
        body: task.description || `Esta tarea vence en ${minutesBefore} minutos`,
        badge: '/badge.png'
      });
    }, notificationTime - now);
    
    // Store timeout id so it can be cleared if needed
    return () => clearTimeout(timeoutId);
  }
};

// Schedule reminders for all active tasks
export const scheduleReminders = (tasks: Task[]): void => {
  const { reminders } = useReminderStore.getState();
  const { settings } = useSettingsStore.getState();
  
  // Only schedule if notifications are enabled
  if (!settings.enableNotifications) return;
  
  // Only schedule for non-completed tasks
  const activeTasks = tasks.filter(task => task.status.toLowerCase() !== 'completada');
  
  // Schedule notifications for each task with a reminder
  activeTasks.forEach(task => {
    const taskReminder = reminders.find(r => r.taskId === task.id && r.enabled);
    if (taskReminder) {
      scheduleNotification(task, taskReminder.minutesBefore);
    }
  });
};
