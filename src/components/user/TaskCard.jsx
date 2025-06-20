import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Calendar, Clock, User, AlertTriangle, Lock } from 'lucide-react';

const TaskCard = ({ task, onClick, isDragging, isAdminView = false, isDraggable = true }) => {
  const { allUsers, allProjects } = useApp();
  
  const assignedUser = allUsers.find(user => user.id === task.assignedTo);
  const project = allProjects.find(project => project.id === task.projectId);
  
  const dueDate = new Date(task.dueDate);
  const today = new Date();
  const isOverdue = task.status !== 'done' && dueDate < today;
  const isDueToday = dueDate.toDateString() === today.toDateString();

  const formatDueDate = (date) => {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg border shadow-sm p-4 cursor-pointer
        hover:shadow-md transition-all duration-200
        ${isDragging ? 'shadow-xl ring-2 ring-blue-400' : ''}
        ${isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'}
        ${isDueToday && !isOverdue ? 'border-yellow-300 bg-yellow-50' : ''}
        ${!isDraggable ? 'opacity-75' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isOverdue && (
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-xs font-medium text-red-600">Overdue</span>
            </div>
          )}
        </div>
        
        {!isDraggable && (
          <div className="flex items-center" title="This task cannot be moved">
            <Lock className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>

      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
        {task.title}
      </h4>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {project && (
        <div className="flex items-center mb-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-xs text-gray-500">{project.name}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`flex items-center ${
            isOverdue ? 'text-red-600' : 
            isDueToday ? 'text-yellow-600' : 'text-gray-500'
          }`}>
            <Calendar className="h-3 w-3 mr-1" />
            <span className="text-xs">
              {formatDueDate(dueDate)}
            </span>
          </div>
        </div>

        {isAdminView && assignedUser && (
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-1">
              <User className="h-3 w-3 text-gray-600" />
            </div>
            <span className="text-xs text-gray-600">
              {assignedUser.name.split(' ')[0]}
            </span>
          </div>        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            task.status === 'done' 
              ? 'bg-green-100 text-green-800'
              : task.status === 'in-progress'
              ? 'bg-yellow-100 text-yellow-800'
              : task.status === 'hold'
              ? 'bg-orange-100 text-orange-800'
              : task.status === 'backlog'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {task.status === 'done' ? 'Completed' : 
             task.status === 'in-progress' ? 'In Progress' : 
             task.status === 'hold' ? 'On Hold' :
             task.status === 'backlog' ? 'Backlog' : 'To Do'}
          </span>
          
          {!isAdminView && isDraggable && (
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
