import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { User, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const UserProgressTable = () => {
  const { allUsers, getUserTasks } = useApp();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);

  const regularUsers = allUsers.filter(user => user.role === 'user');

  const getUserStats = (userId) => {
    const userTasks = getUserTasks(userId);
    return {
      total: userTasks.length,
      todo: userTasks.filter(task => task.status === 'todo').length,
      inProgress: userTasks.filter(task => task.status === 'in-progress').length,
      completed: userTasks.filter(task => task.status === 'done').length
    };
  };

  const handleUserClick = (user) => {
    navigate(`/admin/users/${user.id}`);
  };

  const getOverdueTasksCount = (userId) => {
    const userTasks = getUserTasks(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return userTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return task.status !== 'done' && dueDate < today;
    }).length;
  };

  const UserRow = ({ user }) => {
    const stats = getUserStats(user.id);
    const overdueCount = getOverdueTasksCount(user.id);
    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    return (
      <tr 
        className="hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => handleUserClick(user)}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-4">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-900">{stats.total}</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-yellow-500 mr-2" />
            <span className="text-sm text-gray-900">{stats.inProgress}</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm text-gray-900">{stats.completed}</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-900">{completionRate}%</span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {overdueCount > 0 ? (
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm text-red-600">{overdueCount} overdue</span>
            </div>
          ) : (
            <span className="text-sm text-green-600">On track</span>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Progress</h1>
        <p className="text-gray-600">Monitor team progress and task completion</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Tasks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {regularUsers.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        </div>

        {regularUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Users will appear here once they register</p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">{regularUsers.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tasks in Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {regularUsers.reduce((sum, user) => sum + getUserStats(user.id).inProgress, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">
                {regularUsers.reduce((sum, user) => sum + getUserStats(user.id).completed, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserProgressTable;
