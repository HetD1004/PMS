import React from 'react';
import { useApp } from '../../contexts/AppContext';
import KanbanBoard from './KanbanBoard';

const KanbanBoardPage = () => {
  const { currentUser, getUserTasks } = useApp();
  
  if (!currentUser) return null;

  const userTasks = getUserTasks(currentUser.id);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
        <p className="text-gray-600">Manage your tasks here!</p>
      </div>
      
      <KanbanBoard tasks={userTasks} />
    </div>
  );
};

export default KanbanBoardPage;
