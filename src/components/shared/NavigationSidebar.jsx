import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  Home, 
  FolderOpen, 
  Kanban,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import Button from './Button';

const NavigationSidebar = ({ isCollapsed, onToggleCollapse }) => {
  const { currentUser, logout, getUnreadNotificationsCount } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!currentUser) return null;

  const unreadCount = getUnreadNotificationsCount(currentUser.id);

  const adminNavItems = [
    { 
      path: '/admin', 
      icon: Home, 
      label: 'Dashboard',
      description: 'Overview and analytics'
    },
    { 
      path: '/admin/projects', 
      icon: FolderOpen, 
      label: 'Projects',
      description: 'Manage projects and tasks'
    },
    { 
      path: '/admin/users', 
      icon: User, 
      label: 'Users',
      description: 'User progress tracking'
    },
  ];  const userNavItems = [
    { 
      path: '/user', 
      icon: Home, 
      label: 'Dashboard',
      description: 'Your task overview'
    },
    { 
      path: '/user/kanban', 
      icon: Kanban, 
      label: 'Kanban Board',
      description: 'Manage your tasks'
    },
    { 
      path: '/user/notifications', 
      icon: Bell, 
      label: 'Notifications',
      description: 'Recent updates',
      badge: unreadCount > 0 ? unreadCount : null
    },
  ];
  const navItems = currentUser.role === 'admin' ? adminNavItems : userNavItems;

  const handleLogout = () => {
    console.log('Logout button clicked');
    setShowLogoutConfirm(true);
    console.log('showLogoutConfirm set to true');
  };
  const confirmLogout = () => {
    console.log('Logout initiated');
    logout();
    console.log('User logged out, navigating to login');
    setShowLogoutConfirm(false);
    navigate('/login', { replace: true });
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className={`
      fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-30
      transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>      
    
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} py-6 px-4 border-b border-gray-200`}>
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">

              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              PMS
            </span>
          </div>
        )}

        {!isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="p-2"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}

        {isCollapsed && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
        )}
      </div>

      {isCollapsed && (
        <div className="flex justify-center p-2 border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="p-2"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}      
      
      <div className={`p-4 border-b border-gray-200 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-500 capitalize truncate">
                {currentUser.role}
              </p>
            </div>
          )}
        </div>
      </div>        
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}              
              className={`
                flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-lg text-sm font-medium
                transition-colors duration-200 group relative
                ${isActive 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
              title={isCollapsed ? item.label : ''}
            >
              <item.icon className={`h-5 w-5 flex-shrink-0 ${
                isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              )}
              {isCollapsed && item.badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badge > 9 ? '9' : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`p-4 border-t border-gray-200 space-y-2 ${isCollapsed ? 'px-2' : ''}`}>
        <Button          
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Logout button clicked with event:', e);
            handleLogout();
          }}
          className={`${isCollapsed ? 'w-full justify-center p-3' : 'w-full justify-start px-3 py-3'} text-red-600 hover:text-red-700 hover:bg-red-50`}
          title="Logout"
        >          <LogOut className="h-6 w-6" />
          {!isCollapsed && <span className="ml-3 text-sm font-medium">Logout {showLogoutConfirm ? '(Modal Open)' : ''}</span>}</Button>
      </div>      
      
      {showLogoutConfirm && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center logout-modal" style={{ zIndex: 2147483648 }}>
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl relative" style={{ zIndex: 2147483648 }}>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Logout</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to log out? You'll need to sign in again to access your account.
              </p>
              <div className="flex space-x-3">
                <Button
                  onClick={cancelLogout}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmLogout}
                  variant="danger"
                  className="flex-1"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default NavigationSidebar;
