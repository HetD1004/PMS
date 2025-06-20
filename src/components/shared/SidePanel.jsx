import React from 'react';
import { X, Settings, Filter, Plus, Users, Calendar, Bell, Palette } from 'lucide-react';
import Button from './Button';

const SidePanel = ({ isOpen, onClose, content }) => {
  const renderSettings = () => (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Board Settings</h3>
      
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Theme
          </label>
          <select className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Default</option>
            <option>Dark Mode</option>
            <option>Colorful</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Auto-refresh
          </label>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="auto-refresh" className="rounded" />
            <label htmlFor="auto-refresh" className="text-xs sm:text-sm text-gray-600">
              Enable auto-refresh (30 seconds)
            </label>
          </div>
        </div>
        
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Notifications
          </label>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="task-updates" className="rounded" defaultChecked />
              <label htmlFor="task-updates" className="text-xs sm:text-sm text-gray-600">
                Task updates
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="due-dates" className="rounded" defaultChecked />
              <label htmlFor="due-dates" className="text-xs sm:text-sm text-gray-600">
                Due date reminders
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const renderFilters = () => (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Filter Tasks</h3>
      
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Priority
          </label>
          <div className="space-y-1.5 sm:space-y-2">
            {['high', 'medium', 'low'].map(priority => (
              <div key={priority} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id={`priority-${priority}`} 
                  className="rounded" 
                  defaultChecked 
                />
                <label htmlFor={`priority-${priority}`} className="text-xs sm:text-sm text-gray-600 capitalize">
                  {priority} priority
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Assigned to
          </label>
          <select className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All users</option>
            <option>My tasks only</option>
            <option>Unassigned</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Due date
          </label>
          <select className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All tasks</option>
            <option>Due today</option>
            <option>Due this week</option>
            <option>Overdue</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            Project
          </label>
          <select className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All projects</option>
            <option>Project Alpha</option>
            <option>Project Beta</option>
          </select>
        </div>
        
        <div className="pt-3 sm:pt-4">
          <Button variant="outline" className="w-full text-xs sm:text-sm">
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
  const renderQuickActions = () => (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Quick Actions</h3>
      
      <div className="space-y-2 sm:space-y-3">
        <Button className="w-full justify-start text-xs sm:text-sm p-2 sm:p-3" variant="outline">
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
          <span className="truncate">Create New Task</span>
        </Button>
        
        <Button className="w-full justify-start text-xs sm:text-sm p-2 sm:p-3" variant="outline">
          <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
          <span className="truncate">Assign Tasks</span>
        </Button>
        
        <Button className="w-full justify-start text-xs sm:text-sm p-2 sm:p-3" variant="outline">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
          <span className="truncate">Set Due Dates</span>
        </Button>
        
        <Button className="w-full justify-start text-xs sm:text-sm p-2 sm:p-3" variant="outline">
          <Bell className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
          <span className="truncate">Send Reminders</span>
        </Button>
        
        <Button className="w-full justify-start text-xs sm:text-sm p-2 sm:p-3" variant="outline">
          <Palette className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
          <span className="truncate">Customize Board</span>
        </Button>
      </div>
      
      <div className="pt-3 sm:pt-4 border-t border-gray-200">
        <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Bulk Actions</h4>
        <div className="space-y-1.5 sm:space-y-2">
          <Button className="w-full justify-start text-xs p-2 sm:p-2.5" variant="outline" size="sm">
            <span className="truncate">Move All To Do → In Progress</span>
          </Button>
          <Button className="w-full justify-start text-xs p-2 sm:p-2.5" variant="outline" size="sm">
            <span className="truncate">Archive Completed Tasks</span>
          </Button>
          <Button className="w-full justify-start text-xs p-2 sm:p-2.5" variant="outline" size="sm">
            <span className="truncate">Export Board Data</span>
          </Button>
        </div>
      </div>
    </div>
  );

  const getTitle = () => {
    switch (content) {
      case 'settings':
        return 'Settings';
      case 'filters':
        return 'Filters';
      case 'quickActions':
        return 'Quick Actions';
      default:
        return 'Panel';
    }
  };

  const getIcon = () => {
    switch (content) {
      case 'settings':
        return <Settings className="h-5 w-5" />;
      case 'filters':
        return <Filter className="h-5 w-5" />;
      case 'quickActions':
        return <Plus className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (content) {
      case 'settings':
        return renderSettings();
      case 'filters':
        return renderFilters();
      case 'quickActions':
        return renderQuickActions();
      default:
        return <div>Panel content not found</div>;
    }
  };
  return (
    <>      
      <div 
        className={`
          fixed inset-0 bg-black transition-opacity duration-300 z-40
          ${isOpen ? 'bg-opacity-40 sm:bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />
      <div 
        className={`
          fixed right-0 top-0 h-full bg-white shadow-xl z-50 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          w-80 xs:w-72 sm:w-80 md:w-80 lg:w-96
          max-w-[85vw] xs:max-w-[75vw] sm:max-w-none
          min-w-[280px]
        `}
      >        
        <div className="flex items-center justify-between p-2 sm:p-3 md:p-4 lg:p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 flex-1">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 truncate">
              {getTitle()}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 sm:p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-1 sm:ml-2"
            aria-label="Close panel"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
          </button>
        </div>        
        <div className="p-2 sm:p-3 md:p-4 lg:p-6 overflow-y-auto h-full pb-12 sm:pb-16 md:pb-20">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default SidePanel;
