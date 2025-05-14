import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { FaTasks, FaCalendar, FaBell, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useUserStore } from '@/stores/userStore';
import { useIsMobile } from '@/hooks/use-mobile';

type SidebarProps = {
  activeSection: string;
  onSectionChange: (section: string) => void;
};

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { user, logout } = useUserStore();
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();

  // Close sidebar when section changes on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [activeSection, isMobile]);

  const handleSectionClick = (section: string) => {
    onSectionChange(section);
    
    // Scroll to the section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Hamburger Menu */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:hidden z-10">
        <button 
          onClick={toggleSidebar} 
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <FaBars size={20} />
        </button>
        <div className="font-semibold">Task Manager</div>
        <div></div> {/* Placeholder for right side */}
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 bg-white shadow-lg z-30 transform transition-all duration-300 ease-in-out border-r border-gray-200
          ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
          ${isOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {isOpen && <div className="font-semibold text-lg">Task Manager</div>}
          <button 
            onClick={toggleSidebar} 
            className={`text-gray-500 hover:text-gray-700 focus:outline-none ${isOpen ? 'ml-auto' : 'mx-auto'}`}
          >
            {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
        
        <nav className="mt-5 px-2">
          <a 
            href="#tareas" 
            onClick={(e) => { e.preventDefault(); handleSectionClick('tareas'); }}
            className={`group flex items-center px-4 py-3 rounded-md ${
              activeSection === 'tareas' ? 'bg-purple-100 text-primary' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaTasks className={isOpen ? "mr-3" : "mx-auto"} />
            {isOpen && <span>Tareas</span>}
          </a>
          
          <a 
            href="#calendario" 
            onClick={(e) => { e.preventDefault(); handleSectionClick('calendario'); }}
            className={`group flex items-center px-4 py-3 rounded-md mt-1 ${
              activeSection === 'calendario' ? 'bg-purple-100 text-primary' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaCalendar className={isOpen ? "mr-3" : "mx-auto"} />
            {isOpen && <span>Calendario</span>}
          </a>
          
          <a 
            href="#recordatorios" 
            onClick={(e) => { e.preventDefault(); handleSectionClick('recordatorios'); }}
            className={`group flex items-center px-4 py-3 rounded-md mt-1 ${
              activeSection === 'recordatorios' ? 'bg-purple-100 text-primary' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaBell className={isOpen ? "mr-3" : "mx-auto"} />
            {isOpen && <span>Recordatorios</span>}
          </a>
          
          <a 
            href="#opciones" 
            onClick={(e) => { e.preventDefault(); handleSectionClick('opciones'); }}
            className={`group flex items-center px-4 py-3 rounded-md mt-1 ${
              activeSection === 'opciones' ? 'bg-purple-100 text-primary' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaCog className={isOpen ? "mr-3" : "mx-auto"} />
            {isOpen && <span>Opciones</span>}
          </a>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            {/* User avatar */}
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
              alt="User avatar" 
              className={`h-10 w-10 rounded-full ${!isOpen ? 'mx-auto' : ''}`} 
            />
            {isOpen && (
              <>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user?.name || 'Usuario'}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-gray-700 ml-auto"
                >
                  <FaSignOutAlt />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
