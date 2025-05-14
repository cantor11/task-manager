import { useState } from 'react';
import { useReminderStore } from '@/stores/reminderStore';
import { useTaskStore } from '@/stores/taskStore';
import { Task } from '@shared/schema';
import { Switch } from '@/components/ui/switch';
import ReminderModal from '@/components/modals/ReminderModal';
import { FaEdit } from 'react-icons/fa';

const ReminderList = () => {
  const { reminders, toggleReminder } = useReminderStore();
  const { tasks } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // Helper to find a task by id
  const getTaskById = (taskId: number): Task | undefined => {
    return tasks.find(task => task.id === taskId);
  };

  const handleReminderClick = (taskId: number) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const handleToggleChange = (taskId: number) => {
    toggleReminder(taskId);
  };

  // Format minutes before to human-readable text
  const formatMinutesBefore = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}min antes`;
    } else if (minutes === 60) {
      return '1h antes';
    } else if (minutes < 1440) { // Less than a day
      return `${Math.floor(minutes / 60)}h ${minutes % 60 ? `${minutes % 60}min` : ''} antes`;
    } else {
      return `${Math.floor(minutes / 1440)}d antes`;
    }
  };

  // Get only active tasks (not completed)
  const activeTasks = tasks.filter(task => task.status.toLowerCase() !== 'completada');

  return (
    <div className="space-y-4">
      {activeTasks.length > 0 ? (
        activeTasks.map(task => {
          const reminder = reminders.find(r => r.taskId === task.id);
          return (
            <div 
              key={task.id}
              className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium overflow-hidden overflow-ellipsis line-clamp-2 max-w-[200px]">{task.title}</h3>
                <p className="text-sm text-gray-500">
                  Recordatorio: {reminder ? formatMinutesBefore(reminder.minutesBefore) : '30min antes'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  className="text-gray-600 hover:text-primary"
                  onClick={() => handleReminderClick(task.id)}
                >
                  <FaEdit size={16} />
                </button>
                <Switch 
                  checked={reminder?.enabled ?? false} 
                  onCheckedChange={() => handleToggleChange(task.id)}
                />
              </div>
            </div>
          );
        })
      ) : (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          No hay tareas pendientes. Agrega una nueva tarea para configurar recordatorios.
        </div>
      )}
      
      <ReminderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        taskId={selectedTaskId} 
      />
    </div>
  );
};

export default ReminderList;
