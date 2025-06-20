import React from 'react';
import { useApp } from '../../contexts/AppContext';
import Modal from '../shared/Modal';
import { Calendar, Clock, User, FolderOpen, Tag } from 'lucide-react';

const TaskDetailModal = ({ task, isOpen, onClose, isAdminView = false }) => {
  const { allUsers, allProjects } = useApp();
  
  if (!task) return null;

  const assignedUser = allUsers.find(user => user.id === task.assignedTo);
  const project = allProjects.find(project => project.id === task.projectId);
  
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  const isOverdue = task.status !== 'done' && dueDate < today;
  const isDueToday = dueDate.toDateString() === today.toDateString();

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'done':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'To Do';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      size="lg"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
            {getStatusText(task.status)}
          </span>
          
          {isOverdue && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              Overdue
            </span>
          )}
          
          {isDueToday && !isOverdue && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Due Today
            </span>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h2>
          {task.description && (
            <p className="text-gray-600 leading-relaxed">{task.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Project</p>
                <p className="text-gray-900">{project.name}</p>
              </div>
            </div>
          )}

          {assignedUser && (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Assigned to</p>
                <p className="text-gray-900">{assignedUser.name}</p>
                <p className="text-sm text-gray-500">{assignedUser.email}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isOverdue ? 'bg-red-100' : isDueToday ? 'bg-yellow-100' : 'bg-purple-100'
            }`}>
              <Calendar className={`h-5 w-5 ${
                isOverdue ? 'text-red-600' : isDueToday ? 'text-yellow-600' : 'text-purple-600'
              }`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Due Date</p>
              <p className={`${
                isOverdue ? 'text-red-900' : isDueToday ? 'text-yellow-900' : 'text-gray-900'
              }`}>
                {formatDate(dueDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created</p>
              <p className="text-gray-900">{formatDate(new Date(task.createdAt))}</p>
            </div>
          </div>
        </div>

        {!isAdminView && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">How to update task status:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Drag tasks between columns on your task board</li>
              <li>• Move to "In Progress" when you start working</li>
              <li>• Move to "Done" when completed</li>
            </ul>
          </div>
        )}

        {isAdminView && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Admin View</h3>
            <p className="text-sm text-gray-600">
              You are viewing this task in admin mode. Task status updates are managed by the assigned user.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TaskDetailModal;
