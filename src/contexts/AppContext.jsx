import React, { createContext, useContext, useState, useEffect } from 'react';
import { users, tasks, projects, notifications, getNotificationsByUserId } from '../data/dummyData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState(users);
  const [allTasks, setAllTasks] = useState(tasks);
  const [allProjects, setAllProjects] = useState(projects);
  const [allNotifications, setAllNotifications] = useState(notifications);
  const [taskLogs, setTaskLogs] = useState([
 
    {
      id: 1001,
      taskId: 1,
      taskTitle: 'Set up project structure',
      userId: 1,
      userName: 'User One',
      projectId: 1,
      projectName: 'E-commerce Platform',
      oldStatus: 'todo',
      newStatus: 'in-progress',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      changedBy: 1,
      changedByName: 'User One'
    },
    {
      id: 1002,
      taskId: 2,
      taskTitle: 'Create user authentication',
      userId: 2,
      userName: 'User Two',
      projectId: 1,
      projectName: 'E-commerce Platform',
      oldStatus: 'backlog',
      newStatus: 'todo',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      changedBy: 0,
      changedByName: 'Admin User'
    },
    {
      id: 1003,
      taskId: 3,
      taskTitle: 'Design database schema',
      userId: 1,
      userName: 'User One',
      projectId: 1,
      projectName: 'E-commerce Platform',
      oldStatus: 'in-progress',
      newStatus: 'done',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      changedBy: 1,
      changedByName: 'User One'
    },
    {
      id: 1004,
      taskId: 4,
      taskTitle: 'Implement payment gateway',
      userId: 3,
      userName: 'User Three',
      projectId: 1,
      projectName: 'E-commerce Platform',
      oldStatus: 'todo',
      newStatus: 'hold',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      changedBy: 3,
      changedByName: 'User Three'
    },
    {
      id: 1005,
      taskId: 5,
      taskTitle: 'Create mobile app mockups',
      userId: 4,
      userName: 'User Four',
      projectId: 2,
      projectName: 'Mobile App Redesign',
      oldStatus: 'backlog',
      newStatus: 'in-progress',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      changedBy: 0,
      changedByName: 'Admin User'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = allUsers.find(u => u.email === email && u.password === password);
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        return { success: true, user: userWithoutPassword };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const existingUser = allUsers.find(u => u.email === userData.email);
      if (existingUser) {
        return { success: false, error: 'User with this email already exists' };
      }

      const newUser = {
        id: Date.now(),
        ...userData,
        role: 'user' 
      };

      setAllUsers(prev => [...prev, newUser]);
      const { password: _, ...userWithoutPassword } = newUser;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    console.log('AppContext logout called');
    console.log('Current user before logout:', currentUser);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    console.log('User state cleared and localStorage removed');
  };

  const createTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      createdAt: new Date().toISOString(),
      status: 'todo'
    };
    setAllTasks(prev => [...prev, newTask]);

    if (taskData.assignedTo) {
      const notification = {
        id: Date.now() + 1,
        userId: taskData.assignedTo,
        message: `You have been assigned a new task: ${taskData.title}`,
        createdAt: new Date().toISOString(),
        read: false
      };
      setAllNotifications(prev => [...prev, notification]);
    }

    return newTask;
  };

  const updateTask = (taskId, updatedData) => {
    setAllTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, ...updatedData } : task
      )
    );
  };
  const updateTaskStatus = (taskId, newStatus) => {
    const task = allTasks.find(t => t.id === taskId);
    const oldStatus = task?.status;
    
    if (task && oldStatus !== newStatus) {
      setAllTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      const user = allUsers.find(u => u.id === task.assignedTo);
      const project = allProjects.find(p => p.id === task.projectId);
      const logEntry = {
        id: Date.now(),
        taskId: taskId,
        taskTitle: task.title,
        userId: task.assignedTo,
        userName: user?.name || 'Unassigned',
        projectId: task.projectId,
        projectName: project?.name || 'Unknown Project',
        oldStatus: oldStatus,
        newStatus: newStatus,
        timestamp: new Date().toISOString(),
        changedBy: currentUser?.id || null,
        changedByName: currentUser?.name || 'System'
      };

      setTaskLogs(prev => [logEntry, ...prev]);
    }
  };

  const deleteTask = (taskId) => {
    setAllTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const createProject = (projectData) => {
    const newProject = {
      id: Date.now(),
      ...projectData,
      createdAt: new Date().toISOString(),
      status: 'Planning'
    };
    setAllProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const updateProject = (projectId, updatedData) => {
    setAllProjects(prev => 
      prev.map(project => 
        project.id === projectId ? { ...project, ...updatedData } : project
      )
    );
  };

  const deleteProject = (projectId) => {
    setAllProjects(prev => prev.filter(project => project.id !== projectId));
    setAllTasks(prev => prev.filter(task => task.projectId !== projectId));
  };

  const markNotificationAsRead = (notificationId) => {
    setAllNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = (userId) => {
    setAllNotifications(prev =>
      prev.map(notification =>
        notification.userId === userId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const getTaskLogs = () => {
    return taskLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const getTaskLogsByTaskId = (taskId) => {
    return taskLogs.filter(log => log.taskId === taskId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const getTaskLogsByUserId = (userId) => {
    return taskLogs.filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const clearTaskLogs = () => {
    setTaskLogs([]);
  };

  const getUserTasks = (userId) => {
    return allTasks.filter(task => task.assignedTo === userId);
  };

  const getProjectTasks = (projectId) => {
    return allTasks.filter(task => task.projectId === projectId);
  };

  const getUserNotifications = (userId) => {
    return allNotifications.filter(notification => notification.userId === userId);
  };

  const getUnreadNotificationsCount = (userId) => {
    return allNotifications.filter(notification => 
      notification.userId === userId && !notification.read
    ).length;
  };
  const getStatistics = () => {
    const totalProjects = allProjects.length;
    const totalUsers = allUsers.filter(user => user.role === 'user').length;
    const tasksInProgress = allTasks.filter(task => task.status === 'in-progress').length;
    const tasksCompleted = allTasks.filter(task => task.status === 'done').length;
    const totalTasks = allTasks.length;

    const backlog = allTasks.filter(task => task.status === 'backlog').length;
    const todo = allTasks.filter(task => task.status === 'todo').length;
    const inProgress = allTasks.filter(task => task.status === 'in-progress').length;
    const hold = allTasks.filter(task => task.status === 'hold').length;
    const completed = allTasks.filter(task => task.status === 'done').length;
    const total = allTasks.length;

    return {
      totalProjects,
      totalUsers,
      tasksInProgress,
      tasksCompleted,
      totalTasks,
      backlog,
      todo,
      inProgress,
      hold,
      completed,
      total
    };
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const value = {
    currentUser,
    isLoading,
    allUsers,
    allTasks,
    allProjects,
    allNotifications,
    taskLogs,
    
    login,
    signup,
    logout,
    
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    getUserTasks,
    getProjectTasks,
    
    createProject,
    updateProject,
    deleteProject,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUserNotifications,
    getUnreadNotificationsCount,
    
    getTaskLogs,
    getTaskLogsByTaskId,
    getTaskLogsByUserId,
    clearTaskLogs,
    
    getStatistics
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
