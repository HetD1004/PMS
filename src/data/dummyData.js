export const users = [
  {
    id: 0,
    name: 'Admin User',
    email: 'admin@gmail.com',
    role: 'admin',
    password: 'admin123'
  },
  {
    id: 1,
    name: 'User One',
    email: 'userone@gmail.com',
    role: 'user',
    password: 'user123'
  },
  {
    id: 2,
    name: 'User Two',
    email: 'usertwo@gmail.com',
    role: 'user',
    password: 'user123'
  },
  {
    id: 3,
    name: 'User Three',
    email: 'userthree@gmail.com',
    role: 'user',
    password: 'user123'
  },
  {
    id: 4,
    name: 'User Four',
    email: 'userfour@gmail.com',
    role: 'user',
    password: 'user123'
  },
  {
    id: 5,
    name: 'User Five',
    email: 'userfive@gmail.com',
    role: 'user',
    password: 'user123'
  }
];

export const projects = [
  {
    id: 1,
    name: 'E-commerce Platform',
    description: 'Building a modern e-commerce platform with React and Node.js',
    createdAt: '2024-01-15',
    status: 'In Progress'
  },
  {
    id: 2,
    name: 'Mobile App Development',
    description: 'Cross-platform mobile application using React Native',
    createdAt: '2024-02-01',
    status: 'Planning'
  },
  {
    id: 3,
    name: 'Data Analytics Dashboard',
    description: 'Real-time analytics dashboard for business intelligence',
    createdAt: '2024-01-20',
    status: 'In Progress'
  }
];

export const tasks = [
  {
    id: 1,
    title: 'Setup Project Structure',
    description: 'Initialize the project with proper folder structure and dependencies',
    dueDate: '2024-12-20',
    status: 'done',
    priority: 'high',
    projectId: 1,
    assignedTo: 2,
    createdAt: '2024-12-01'
  },
  {
    id: 2,
    title: 'Design User Interface',
    description: 'Create wireframes and mockups for the main user interface',
    dueDate: '2024-12-25',
    status: 'in-progress',
    priority: 'medium',
    projectId: 1,
    assignedTo: 2,
    createdAt: '2024-12-05'
  },
  {
    id: 3,
    title: 'Implement Authentication',
    description: 'Build login and registration functionality',
    dueDate: '2024-12-30',
    status: 'todo',
    priority: 'high',
    projectId: 1,
    assignedTo: 3,
    createdAt: '2024-12-08'
  },
  {
    id: 4,
    title: 'Database Schema Design',
    description: 'Design and implement the database schema',
    dueDate: '2024-12-22',
    status: 'in-progress',
    priority: 'high',
    projectId: 2,
    assignedTo: 4,
    createdAt: '2024-12-02'
  },
  {
    id: 5,
    title: 'API Documentation',
    description: 'Create comprehensive API documentation',
    dueDate: '2024-12-28',
    status: 'todo',
    priority: 'low',
    projectId: 2,
    assignedTo: 5,
    createdAt: '2024-12-06'
  },  {
    id: 6,
    title: 'Setup CI/CD Pipeline',
    description: 'Configure continuous integration and deployment',
    dueDate: '2024-12-15',
    status: 'done',
    priority: 'medium',
    projectId: 3,
    assignedTo: 2,
    createdAt: '2024-11-28'
  },
  {
    id: 7,
    title: 'Mobile App Research',
    description: 'Research mobile app development frameworks and requirements',
    dueDate: '2025-01-15',
    status: 'backlog',
    priority: 'low',
    projectId: 1,
    assignedTo: null,
    createdAt: '2024-12-10'
  },
  {
    id: 8,
    title: 'Payment Gateway Integration',
    description: 'Integrate Stripe payment gateway for processing payments',
    dueDate: '2024-12-28',
    status: 'hold',
    priority: 'high',
    projectId: 1,
    assignedTo: 3,
    createdAt: '2024-12-08'
  },  {
    id: 9,
    title: 'User Feedback System',
    description: 'Implement user feedback and rating system',
    dueDate: '2025-01-05',
    status: 'backlog',
    priority: 'medium',
    projectId: 2,
    assignedTo: null,
    createdAt: '2024-12-09'
  },
  {
    id: 10,
    title: 'Performance Optimization',
    description: 'Optimize application performance and loading times',
    dueDate: '2024-12-26',
    status: 'hold',
    priority: 'high',
    projectId: 2,
    assignedTo: 4,
    createdAt: '2024-12-07'
  }
];

export const notifications = [
  {
    id: 1,
    userId: 2,
    message: 'You have been assigned a new task: Design User Interface',
    createdAt: '2024-12-05',
    read: false
  },
  {
    id: 2,
    userId: 3,
    message: 'You have been assigned a new task: Implement Authentication',
    createdAt: '2024-12-08',
    read: false
  },
  {
    id: 3,
    userId: 2,
    message: 'Task "Setup Project Structure" is due tomorrow',
    createdAt: '2024-12-19',
    read: true
  }
];

export const getTasksByUserId = (userId) => {
  return tasks.filter(task => task.assignedTo === userId);
};

export const getTasksByProjectId = (projectId) => {
  return tasks.filter(task => task.projectId === projectId);
};

export const getUserById = (userId) => {
  return users.find(user => user.id === userId);
};

export const getProjectById = (projectId) => {
  return projects.find(project => project.id === projectId);
};

export const getNotificationsByUserId = (userId) => {
  return notifications.filter(notification => notification.userId === userId);
};

export const getUnreadNotificationsCount = (userId) => {
  return notifications.filter(notification => 
    notification.userId === userId && !notification.read
  ).length;
};
