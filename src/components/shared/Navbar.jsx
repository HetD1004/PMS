import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Bell, Search, User, X } from 'lucide-react';

const Navbar = () => {
  const { currentUser, getUnreadNotificationsCount, allTasks, allProjects } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  
  if (!currentUser) return null;

  const unreadCount = getUnreadNotificationsCount(currentUser.id);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = [];

    
    if (!allTasks || allTasks.length === 0) {
      setSearchResults([]);
      setShowResults(true);
      return;
    }

    
    const tasksToSearch = currentUser.role === 'admin' 
      ? allTasks 
      : allTasks.filter(task => task.assignedTo === currentUser.id);

    tasksToSearch.forEach(task => {
      if (
        (task.title && task.title.toLowerCase().includes(lowerQuery)) ||
        (task.description && task.description.toLowerCase().includes(lowerQuery))
      ) {
        results.push({
          type: 'task',
          id: task.id,
          title: task.title,
          subtitle: task.description || 'No description',
          status: task.status,
          priority: task.priority || 'medium' 
        });
      }
    });

    
    if (currentUser.role === 'admin' && allProjects && allProjects.length > 0) {
      allProjects.forEach(project => {
        if (
          (project.name && project.name.toLowerCase().includes(lowerQuery)) ||
          (project.description && project.description.toLowerCase().includes(lowerQuery))
        ) {
          results.push({
            type: 'project',
            id: project.id,
            title: project.name,
            subtitle: project.description || 'No description',
            status: project.status
          });
        }
      });
    }

    setSearchResults(results.slice(0, 8)); 
    setShowResults(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'todo':
      case 'backlog':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'hold':
        return 'bg-orange-100 text-orange-800';
      case 'done':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    if (!priority) return 'bg-gray-100 text-gray-800';
    
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  const handleResultClick = (result) => {
    if (result.type === 'task') {
      
      if (currentUser.role === 'user') {
        navigate('/user');
        
        setTimeout(() => {
          const kanbanElement = document.getElementById('kanban-board');
          if (kanbanElement) {
            kanbanElement.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        
        navigate('/admin/projects');
      }
    } else if (result.type === 'project') {
      
      navigate('/admin/projects');
    }
    
    setShowResults(false);
    setSearchQuery('');
  };
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-full">
        <div className="flex items-center min-w-0">
          <h1 className="text-xl font-semibold text-gray-900 truncate">
            {currentUser.role === 'admin' ? 'Admin Panel' : 'My Workspace'}
          </h1>
        </div>        <div className="flex items-center space-x-4 flex-shrink-0">
          <div className="hidden md:block relative" ref={searchRef}>            <div className="relative">
              <div 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none flex items-center justify-center"
                style={{ zIndex: 30 }}
              >
                <Search className="h-5 w-5 text-gray-600" style={{ display: 'block' }} />
              </div>
              <input
                type="text"
                placeholder="Search tasks, projects..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
                className="pl-11 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80 bg-white"
                style={{ position: 'relative', zIndex: 10 }}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-20"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {showResults && (
              <div className="search-dropdown absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((result) => (
                      <div
                        key={`${result.type}-${result.id}`}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {result.title}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {result.subtitle}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                              {formatStatus(result.status)}
                            </span>
                            {result.priority && (
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(result.priority)}`}>
                                {result.priority.charAt(0).toUpperCase() + result.priority.slice(1)}
                              </span>
                            )}
                            <span className="text-xs text-gray-400 capitalize font-medium">
                              {result.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-sm text-gray-500 text-center">
                    <div className="flex flex-col items-center">
                      <Search className="h-8 w-8 text-gray-300 mb-2" />
                      <p>No results found for "{searchQuery}"</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>            {currentUser.role === 'user' && (
            <div className="relative">
              <button 
                onClick={() => navigate('/user/notifications')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="View Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 leading-tight">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-500 leading-tight">
                {currentUser.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
