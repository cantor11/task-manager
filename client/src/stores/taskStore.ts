import { create } from 'zustand';
import { Task } from '@shared/schema';
import { scheduleReminders } from '@/utils/notifications';
import { useUserStore } from './userStore';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  getTasks: (userId?: string) => Promise<void>;
  addTask: (taskData: Omit<Task, 'id' | 'userId'>) => Promise<Task>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskFlag: (id: number) => void;
  clearTasks: () => void;
}

const BACKEND_URL = '/api';

const safeParseDate = (date: any): Date | null => {
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d;
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  getTasks: async (userId?: string) => {
    set({ isLoading: true, error: null });
    try {
      let url = `${BACKEND_URL}/tasks`;
      if (userId) {
        url += `?userId=${userId}`;
      }
      console.log('Solicitando tareas para userId:', userId);
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al obtener tareas');
      const tasks = await res.json();
      const formattedTasks = tasks.map((task: any) => ({
        ...task,
        dueDate: safeParseDate(task.dueDate),
        status: task.status ?? 'pendiente', // Asegura que siempre haya un status
      }));
      set({ tasks: formattedTasks });
      scheduleReminders(formattedTasks);
    } catch (error) {
      set({ error: 'Error al cargar tareas' });
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const user = useUserStore.getState().user;
      const userId = user?.uid ? user.uid : "demo"; // fallback si no user
      const res = await fetch(`${BACKEND_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          userId,
          completed: false, // requerido por el backend
          flagged: false, // por defecto
          status: 'pendiente', // por defecto
        }),
      });
      if (!res.ok) throw new Error('Error al crear tarea');
      const newTask = await res.json();
      const completedTask = {
        ...newTask,
        priority: newTask.priority ?? taskData.priority,
        status: newTask.status ?? 'pendiente',
        description: newTask.description ?? taskData.description ?? '',
        dueDate: safeParseDate(newTask.dueDate),
      };
      const updatedTasks = [
        ...get().tasks,
        completedTask,
      ];
      set({ tasks: updatedTasks });
      scheduleReminders(updatedTasks);
      return completedTask;
    } catch (error) {
      set({ error: 'Error al crear tarea' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTask: async (updatedTask) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${BACKEND_URL}/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });
      if (!res.ok) throw new Error('Error al actualizar tarea');
      const updated = await res.json();
      const tasks = get().tasks.map(t =>
        t.id === updated.id
          ? { ...updated, dueDate: safeParseDate(updated.dueDate) }
          : t
      );
      set({ tasks });
      scheduleReminders(tasks);
    } catch (error) {
      set({ error: 'Error al actualizar tarea' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${BACKEND_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        set({ error: 'Error al eliminar tarea' });
        throw new Error('Error al eliminar tarea');
      }
      const tasks = get().tasks.filter(t => t.id !== id);
      set({ tasks });
      scheduleReminders(tasks);
      // No lanzar excepción si todo salió bien
      return;
    } catch (error) {
      set({ error: 'Error al eliminar tarea' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleTaskFlag: (id) => {
    const { tasks, updateTask } = get();
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTask({ ...task, flagged: !task.flagged });
    }
  },
  clearTasks: () => set({ tasks: [] }),
}));
