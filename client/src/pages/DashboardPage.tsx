import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TaskList from '@/components/TaskList';
import TaskChart from '@/components/TaskChart';
import ReminderList from '@/components/ReminderList';
import OptionsSection from '@/components/OptionsSection';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/stores/taskStore';
import TaskModal from '@/components/modals/TaskModal';

const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState('tareas');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const { getTasks } = useTaskStore();

  // Fetch tasks on component mount
  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 overflow-auto h-full transition-all duration-300 ease-in-out" 
           style={{ marginLeft: "0", paddingLeft: "80px" }}>
        <main className="p-4 md:p-6 pt-20 md:pt-6 pb-24">
          {/* Tasks Section */}
          <section id="tareas" className="mb-10 pt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold mb-4 md:mb-0">Lista de Tareas</h2>
              <Button 
                onClick={() => setIsTaskModalOpen(true)}
                className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-2 rounded-full transition duration-200 flex items-center justify-center w-full md:w-auto"
              >
                <span className="mr-2">+</span> Agregar Tarea
              </Button>
            </div>
            
            <TaskList />
          </section>
          
          {/* Calendar Section */}
          <section id="calendario" className="mb-10 pt-4">
            <h2 className="text-2xl font-semibold mb-6">Calendario</h2>
            <TaskChart />
          </section>
          
          {/* Reminders Section */}
          <section id="recordatorios" className="mb-10 pt-4">
            <h2 className="text-2xl font-semibold mb-6">Recordatorios</h2>
            <ReminderList />
          </section>
          
          {/* Options Section */}
          <section id="opciones" className="mb-10 pt-4">
            <h2 className="text-2xl font-semibold mb-6">Opciones</h2>
            <OptionsSection />
          </section>
        </main>
      </div>
      
      {/* Add Task Modal */}
      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        task={null}
      />
    </div>
  );
};

export default DashboardPage;
