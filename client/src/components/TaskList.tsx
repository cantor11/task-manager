import { useState } from 'react';
import { FaFlag, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import { useTaskStore } from '@/stores/taskStore';
import { Task } from '@shared/schema';
import TaskModal from '@/components/modals/TaskModal';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';
import CompleteConfirmationModal from '@/components/modals/CompleteConfirmationModal';

const TaskList = () => {
  const { tasks, toggleTaskFlag } = useTaskStore();
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleCompleteTask = (task: Task) => {
    setTaskToComplete(task);
    setIsCompleteModalOpen(true);
  };

  const handleFlagToggle = (task: Task) => {
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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <div className="max-h-[calc(48px*10)] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"></th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-3 py-4">
                    <button 
                      className={`${task.flagged ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
                      onClick={() => handleFlagToggle(task)}
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
                    {task.status.toLowerCase() !== 'completada' && (
                      <>
                        <button 
                          className="text-indigo-600 hover:text-indigo-900 mr-2"
                          onClick={() => handleEditTask(task)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 mr-2"
                          onClick={() => handleDeleteTask(task)}
                        >
                          <FaTrash />
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900"
                          onClick={() => handleCompleteTask(task)}
                        >
                          <FaCheck />
                        </button>
                      </>
                    )}
                    {task.status.toLowerCase() === 'completada' && (
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteTask(task)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No hay tareas disponibles. Agrega una nueva tarea para comenzar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => { setIsTaskModalOpen(false); setTaskToEdit(null); }} 
        task={taskToEdit} 
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => { setIsDeleteModalOpen(false); setTaskToDelete(null); }} 
        task={taskToDelete} 
      />

      <CompleteConfirmationModal 
        isOpen={isCompleteModalOpen} 
        onClose={() => { setIsCompleteModalOpen(false); setTaskToComplete(null); }} 
        task={taskToComplete} 
      />
    </div>
  );
};

export default TaskList;