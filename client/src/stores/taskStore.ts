import { create } from 'zustand';
import { Task } from '@shared/schema';
import { scheduleReminders } from '@/utils/notifications';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  getTasks: () => Promise<void>;
  addTask: (taskData: Omit<Task, 'id' | 'userId'>) => Promise<Task>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskFlag: (id: number) => void;
}

// Demo tasks
const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Revisar informe',
    description: 'Revisar y enviar el informe mensual',
    dueDate: new Date('2024-06-10T17:00:00'),
    priority: 'alta',
    status: 'pendiente',
    flagged: false,
    userId: 1
  },
  {
    id: 2,
    title: 'Llamar cliente',
    description: 'Confirmar reunión semanal',
    dueDate: new Date('2024-06-12T09:00:00'),
    priority: 'media',
    status: 'en-progreso',
    flagged: false,
    userId: 1
  },
  {
    id: 3,
    title: 'Actualizar software',
    description: 'Instalar la última versión',
    dueDate: new Date('2024-06-15T14:00:00'),
    priority: 'baja',
    status: 'completada',
    flagged: false,
    userId: 1
  }
];

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  getTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load tasks from localStorage or use demo tasks
      const storedTasks = localStorage.getItem('tasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : initialTasks;
      
      // Convert string dates to Date objects
      const formattedTasks = tasks.map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate)
      }));
      
      set({ tasks: formattedTasks });
      
      // Schedule reminders for pending tasks
      scheduleReminders(formattedTasks);
    } catch (error) {
      set({ error: 'Error loading tasks' });
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      // Generate a new id
      const { tasks } = get();
      const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: newId,
        userId: 1 // Current user id
      };
      
      // Update state
      const updatedTasks = [...tasks, newTask];
      set({ tasks: updatedTasks });
      
      // Save to localStorage
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      
      // Schedule reminders
      scheduleReminders(updatedTasks);
      
      return newTask;
    } catch (error) {
      set({ error: 'Error adding task' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (updatedTask) => {
    set({ isLoading: true, error: null });
    try {
      const { tasks } = get();
      
      // Find and update the task
      const updatedTasks = tasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      );
      
      // Update state
      set({ tasks: updatedTasks });
      
      // Save to localStorage
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      
      // Schedule reminders
      scheduleReminders(updatedTasks);
    } catch (error) {
      set({ error: 'Error updating task' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { tasks } = get();
      
      // Filter out the deleted task
      const updatedTasks = tasks.filter(task => task.id !== id);
      
      // Update state
      set({ tasks: updatedTasks });
      
      // Save to localStorage
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      set({ error: 'Error deleting task' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleTaskFlag: (id) => {
    const { tasks, updateTask } = get();
    const task = tasks.find(t => t.id === id);
    
    if (task) {
      updateTask({
        ...task,
        flagged: !task.flagged
      });
    }
  }
}));
