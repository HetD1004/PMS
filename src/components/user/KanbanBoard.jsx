import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useApp } from '../../contexts/AppContext';
import TaskCard from './TaskCard';
import TaskDetailModal from './TaskDetailModal';
import SidePanel from '../shared/SidePanel';
import { Settings, Filter, Plus } from 'lucide-react';
import Button from '../shared/Button';

const KanbanBoard = ({ tasks, isAdminView = false }) => {
  const { updateTaskStatus, currentUser } = useApp();  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(isAdminView ? false : false);
  const [sidePanelContent, setSidePanelContent] = useState('settings');
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (isAdminView) {
      setIsSidePanelOpen(false);
    }
  }, [isAdminView]);  
  useEffect(() => {
    return () => {
      setIsSidePanelOpen(false);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggedTask) {
        setDragPosition({ x: e.clientX, y: e.clientY });
      }
    };

    if (draggedTask) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [draggedTask]);

  const tasksByStatus = {
    backlog: tasks.filter(task => task.status === 'backlog'),
    todo: tasks.filter(task => task.status === 'todo'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    hold: tasks.filter(task => task.status === 'hold'),
    done: tasks.filter(task => task.status === 'done')
  };  
  const handleDragStart = (start) => {
    const taskId = parseInt(start.draggableId);
    const task = tasks.find(t => t.id === taskId);
    setDraggedTask(task);
    
    setTimeout(() => {
      const draggedElement = document.querySelector(`[data-rbd-draggable-id="${start.draggableId}"]`);
      if (draggedElement) {
        draggedElement.style.zIndex = '2147483647';
        draggedElement.style.position = 'fixed';
      }
      const fixedElements = document.querySelectorAll('div[style*="position: fixed"]');
      fixedElements.forEach(el => {
        if (el.style.transform && el.style.transform.includes('translate')) {
          el.style.zIndex = '2147483647';
        }
      });
      
      document.body.style.cursor = 'grabbing';
      
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.style && node.style.position === 'fixed' && node.style.transform) {
                node.style.zIndex = '999999';
              }
              const childFixedElements = node.querySelectorAll && node.querySelectorAll('div[style*="position: fixed"]');
              if (childFixedElements) {
                childFixedElements.forEach(el => {
                  if (el.style.transform) {
                    el.style.zIndex = '999999';
                  }
                });
              }
            }
          });
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      window.dragObserver = observer;
      
      const pollInterval = setInterval(() => {
        const fixedEls = document.querySelectorAll('div[style*="position: fixed"]');
        fixedEls.forEach(el => {
          if (el.style.transform && el.style.transform.includes('translate')) {
            el.style.zIndex = '999999';
          }
        });
        
        const draggableEls = document.querySelectorAll(`[data-rbd-draggable-id="${start.draggableId}"]`);
        draggableEls.forEach(el => {
          el.style.zIndex = '999999';
        });
      }, 16); 
      
      window.dragPollInterval = pollInterval;
    }, 10);
  };  const handleDragEnd = (result) => {
    setDraggedTask(null);
    
    if (window.dragObserver) {
      window.dragObserver.disconnect();
      window.dragObserver = null;
    }
    
    if (window.dragPollInterval) {
      clearInterval(window.dragPollInterval);
      window.dragPollInterval = null;
    }
    
    const draggedElements = document.querySelectorAll('[data-rbd-draggable-id]');
    draggedElements.forEach(el => {
      el.style.zIndex = '';
    });
    
    const fixedElements = document.querySelectorAll('div[style*="position: fixed"]');
    fixedElements.forEach(el => {
      if (el.style.transform) {
        el.style.zIndex = '';
      }
    });
    
    document.body.style.cursor = '';
    
    const { destination, source, draggableId } = result;

    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const taskId = parseInt(draggableId);
    const sourceStatus = source.droppableId;
    const destinationStatus = destination.droppableId;
    
    const taskBeingMoved = tasks.find(task => task.id === taskId);
    if (!taskBeingMoved) return;
    
    if (sourceStatus === 'done') {
      return;
    }

    if (destinationStatus === 'backlog' && (!currentUser || currentUser.role !== 'admin')) {
      return;
    }

    if (destinationStatus === 'in-progress') {
      const tasksInProgress = tasks.filter(task => task.status === 'in-progress' && task.id !== taskId);
      if (tasksInProgress.length > 0) {
        alert('Only one task can be in progress at a time. Please move the current in-progress task first.');
        return;
      }
    }

    updateTaskStatus(taskId, destinationStatus);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };  const handleOpenSidePanel = (content) => {
    if (isAdminView) {
      return;
    }
    setSidePanelContent(content);
    setIsSidePanelOpen(true);
  };

  const isTaskDraggable = (task) => {
    if (isAdminView) {
      return task.status !== 'done';
    }

    if (task.status === 'done') {
      return false;
    }
    return true;
  };  const columns = [
    { 
      id: 'backlog', 
      title: 'Backlog', 
      color: 'bg-gradient-to-br from-slate-50 to-slate-100',
      headerColor: 'bg-gradient-to-r from-slate-600 to-slate-700 text-white',
      icon: '📋',
      description: 'Future planning'
    },
    { 
      id: 'todo', 
      title: 'To Do', 
      color: 'bg-gradient-to-br from-blue-50 to-blue-100',
      headerColor: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
      icon: '📝',
      description: 'Ready to start'
    },
    { 
      id: 'in-progress', 
      title: 'In Progress', 
      color: 'bg-gradient-to-br from-amber-50 to-yellow-100',
      headerColor: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white',
      icon: '⚡',
      description: 'Active work'
    },
    { 
      id: 'hold', 
      title: 'On Hold', 
      color: 'bg-gradient-to-br from-orange-50 to-orange-100',
      headerColor: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
      icon: '⏸️',
      description: 'Temporarily paused'
    },
    { 
      id: 'done', 
      title: 'Completed', 
      color: 'bg-gradient-to-br from-emerald-50 to-green-100',
      headerColor: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
      icon: '✅',
      description: 'Finished tasks'
    }
  ];  return (    <div className="relative">
      <div className="mb-8 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Task Board
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live Updates</span>
          </div>
        </div>
      </div>

      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>        
        <div className="overflow-x-auto pb-8 scrollbar-hide">
          <div className="flex gap-8 min-w-max px-2">
            {columns.map((column, index) => (
            <div 
              key={column.id} 
              className="flex flex-col w-80 flex-shrink-0 transform transition-all duration-500 hover:scale-105 relative"
              style={{ 
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className={`${column.headerColor} px-6 py-5 rounded-t-2xl shadow-lg relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/30"></div>
                  <div className="absolute -left-2 -bottom-2 w-12 h-12 rounded-full bg-white/20"></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{column.icon}</span>
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {column.title}
                        {column.id === 'backlog' && (
                          <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full font-medium">
                            Admin
                          </span>
                        )}
                      </h3>
                      <p className="text-xs opacity-80">{column.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      {tasksByStatus[column.id].length}
                    </span>
                  </div>                </div>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      ${column.color} 
                      rounded-b-2xl p-6 h-[600px] shadow-lg border-t-0
                      ${snapshot.isDraggingOver ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50/50' : ''}
                      transition-all duration-300 overflow-y-auto
                      scrollbar-hide
                      [&::-webkit-scrollbar]:hidden
                      [-ms-overflow-style:none]
                      [scrollbar-width:none]
                    `}
                  >                    <div className="space-y-4 h-full">
                      {tasksByStatus[column.id].length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner">
                            <span className="text-2xl opacity-60">{column.icon}</span>
                          </div>
                          <p className="text-lg font-semibold text-gray-600 mb-2">No tasks yet</p>
                          <p className="text-sm text-gray-400 mb-1">{column.description}</p>
                          {!isAdminView && column.id === 'todo' && (
                            <p className="text-xs text-gray-400 mt-3 bg-blue-50 px-3 py-2 rounded-full inline-block">
                              ✨ New tasks will appear here
                            </p>
                          )}
                          {column.id === 'backlog' && (
                            <p className="text-xs text-gray-400 mt-3 bg-purple-50 px-3 py-2 rounded-full inline-block">
                              📋 Admin assigned tasks for future planning
                            </p>
                          )}
                          {column.id === 'in-progress' && (
                            <p className="text-xs text-gray-400 mt-3 bg-yellow-50 px-3 py-2 rounded-full inline-block">
                              ⚡ Only one task can be active at a time
                            </p>
                          )}
                          {column.id === 'hold' && (
                            <p className="text-xs text-gray-400 mt-3 bg-orange-50 px-3 py-2 rounded-full inline-block">
                              ⏸️ Paused tasks can move anywhere
                            </p>
                          )}
                          {column.id === 'done' && (
                            <p className="text-xs text-gray-400 mt-3 bg-green-50 px-3 py-2 rounded-full inline-block">
                              🔒 Completed tasks cannot be moved
                            </p>
                          )}
                        </div>
                      )}
                      
                      {tasksByStatus[column.id].map((task, index) => (<Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                          isDragDisabled={!isTaskDraggable(task)}
                        >
                          {(provided, snapshot) => {
                            const style = {
                              ...provided.draggableProps.style,
                            };
                            if (snapshot.isDragging) {
                              style.zIndex = '2147483647';
                              style.position = 'fixed';
                              style.pointerEvents = 'none';
                              style.transform = provided.draggableProps.style?.transform || 'none';
                              style.left = provided.draggableProps.style?.left || 'auto';
                              style.top = provided.draggableProps.style?.top || 'auto';
                              style.opacity = '0';
                            }
                            
                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={style}
                                className={`
                                  ${snapshot.isDragging ? 'shadow-2xl opacity-90 !z-[999999]' : ''}
                                  transition-shadow duration-200
                                `}
                                data-dragging={snapshot.isDragging}
                              >
                                <TaskCard
                                  task={task}
                                  onClick={() => handleTaskClick(task)}
                                  isDragging={snapshot.isDragging}
                                  isAdminView={isAdminView}
                                  isDraggable={isTaskDraggable(task)}
                                />
                              </div>
                            );
                          }}
                        </Draggable>
                      ))}                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>))}
        </div>
        </div>
      </DragDropContext>

      {draggedTask && typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 2147483647,
            width: '100%',
            height: '100%',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: dragPosition.x - 160, 
              top: dragPosition.y - 80,
              transform: 'rotate(5deg) scale(1.05)',
              transition: 'none',
              zIndex: 2147483647,
            }}
            className="w-80 opacity-90 shadow-2xl"
          >
            <TaskCard
              task={draggedTask}
              onClick={() => {}}
              isDragging={true}
              isAdminView={isAdminView}
              isDraggable={true}
            />
          </div>
        </div>,
        document.body
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
          isAdminView={isAdminView}
        />
      )}      
      {!isAdminView && (
        <SidePanel
          isOpen={isSidePanelOpen}
          onClose={() => setIsSidePanelOpen(false)}
          content={sidePanelContent}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
