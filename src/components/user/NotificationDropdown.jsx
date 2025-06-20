import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { Bell, Check, Trash2, Mail } from 'lucide-react';

const NotificationDropdown = () => {
  const { 
    currentUser, 
    getUserNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead 
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  
  if (!currentUser) return null;

  const notifications = getUserNotifications(currentUser.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (notificationId, e) => {
    e.stopPropagation();
    markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead(currentUser.id);
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your latest task assignments and updates</p>
        </div>
        
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Notifications</p>
              <p className="text-2xl font-semibold text-gray-900">{notifications.length}</p>
            </div>
          </div>
        </Card>        
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Mail className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Unread</p>
              <p className="text-2xl font-semibold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Read</p>
              <p className="text-2xl font-semibold text-gray-900">{notifications.length - unreadCount}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Recent Notifications">
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.read 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.read ? 'bg-gray-400' : 'bg-blue-500'
                    }`}></div>
                    
                    <div className="flex-1">
                      <p className={`text-sm ${
                        notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>

                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                      className="text-blue-600 hover:text-blue-700 p-1"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
              <p className="text-gray-500">
                You'll see notifications here when you're assigned new tasks or when there are updates.
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card title="Notification Tips" className="mt-8">
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p>Blue notifications are unread. Click the check mark to mark them as read.</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
            <p>Gray notifications have been read and are archived here for your reference.</p>
          </div>
          <div className="flex items-start space-x-3">
            <Bell className="h-4 w-4 text-gray-400 mt-0.5" />
            <p>The bell icon in the navigation shows a red badge when you have unread notifications.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotificationDropdown;
