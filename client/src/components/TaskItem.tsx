import { useState } from 'react';
import { FaFlag, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import { Task } from '@shared/schema';
import { useTaskStore } from '@/stores/taskStore';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onComplete: (task: Task) => void;
}

const TaskItem = ({ task, onEdit, onDelete, onComplete }: TaskItemProps) => {
  const { toggleTaskFlag } = useTaskStore();

  const handleFlagToggle = () => {
    toggleTaskFlag(task.id);
  };

  const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta':
        return 'bg-alta text-alta';
      case 'media':
        return 'bg-media text-media';
      case 'baja':
        return 'bg-baja text-baja';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'en progreso':
      case 'en-progreso':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toTimeString().slice(0, 5);
  };

  // Avatar images for users - using a consistent one based on task ID
  const avatars = [
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  ];

  // Get a consistent avatar based on task id
  const getAvatar = (taskId: number) => avatars[taskId % avatars.length];

  return (
    <tr>
      <td className="px-3 py-4">
        <button 
          className={`${task.flagged ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
          onClick={handleFlagToggle}
        >
          <FaFlag />
        </button>
      </td>

      <td className="px-6 py-4 max-w-[200px]">
        <div className="text-sm font-medium text-gray-900 truncate whitespace-nowrap">{task.title}</div>
      </td>
      <td className="px-6 py-4 max-w-[200px]">
        <div className="text-sm text-gray-500 truncate whitespace-nowrap">{task.description}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{formatDate(task.dueDate)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{formatTime(task.dueDate)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass(task.priority)}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(task.status)}`}>
          {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button 
          className="text-indigo-600 hover:text-indigo-900 mr-2"
          onClick={() => onEdit(task)}
        >
          <FaEdit />
        </button>
        <button 
          className="text-red-600 hover:text-red-900 mr-2"
          onClick={() => onDelete(task)}
        >
          <FaTrash />
        </button>
        {task.status.toLowerCase() !== 'completada' && (
          <button 
            className="text-green-600 hover:text-green-900"
            onClick={() => onComplete(task)}
          >
            <FaCheck />
          </button>
        )}
      </td>
    </tr>
  );
};

export default TaskItem;
