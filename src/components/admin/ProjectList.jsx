import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Modal from '../shared/Modal';
import CreateTaskModal from './CreateTaskModal';
import { Plus, FolderOpen, Calendar, Users, Trash2, Edit, Eye } from 'lucide-react';

const ProjectList = () => {
  const { allProjects, createProject, updateProject, deleteProject, getProjectTasks, allUsers, allTasks, updateTask, deleteTask } = useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isViewTasksModalOpen, setIsViewTasksModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });
  const [editProject, setEditProject] = useState({
    id: null,
    name: '',
    description: ''
  });
  const [editTask, setEditTask] = useState({
    id: null,
    title: '',
    description: '',
    priority: 'medium',
    assignedTo: '',
    status: 'todo'
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (newProject.name.trim()) {
      createProject(newProject);
      setNewProject({ name: '', description: '' });
      setIsCreateModalOpen(false);
    }
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      deleteProject(projectId);
    }
  };

  const handleCreateTask = (project) => {
    setSelectedProject(project);
    setIsTaskModalOpen(true);
  };

  const handleEditProject = (project) => {
    setEditProject({
      id: project.id,
      name: project.name,
      description: project.description
    });
    setIsEditProjectModalOpen(true);
  };

  const handleUpdateProject = (e) => {
    e.preventDefault();
    if (editProject.name.trim()) {
      updateProject(editProject.id, {
        name: editProject.name,
        description: editProject.description
      });
      setIsEditProjectModalOpen(false);
      setEditProject({ id: null, name: '', description: '' });
    }
  };

  const handleViewTasks = (project) => {
    setSelectedProject(project);
    setIsViewTasksModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditTask({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      assignedTo: task.assignedTo,
      status: task.status
    });
    setIsEditTaskModalOpen(true);
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    if (editTask.title.trim()) {
      updateTask(editTask.id, {
        title: editTask.title,
        description: editTask.description,
        priority: editTask.priority,
        assignedTo: editTask.assignedTo,
        status: editTask.status
      });
      setIsEditTaskModalOpen(false);
      setEditTask({ id: null, title: '', description: '', priority: 'medium', assignedTo: '', status: 'todo' });
    }
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const ProjectCard = ({ project }) => {
    const projectTasks = getProjectTasks(project.id);
    const completedTasks = projectTasks.filter(task => task.status === 'done').length;
    const totalTasks = projectTasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
      <Card className="hover:shadow-md transition-shadow">        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
              <p className="text-sm text-gray-500">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewTasks(project)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              title="View Tasks"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditProject(project)}
              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
              title="Edit Project"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteProject(project.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Delete Project"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{project.description}</p>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{completedTasks}/{totalTasks} tasks</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                {totalTasks} tasks
              </span>
              <span className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                {new Set(projectTasks.map(task => task.assignedTo)).size} members
              </span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              project.status === 'Completed' 
                ? 'bg-green-100 text-green-800'
                : project.status === 'In Progress'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {project.status}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button
            onClick={() => handleCreateTask(project)}
            size="sm"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your projects and tasks</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {allProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first project</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewProject({ name: '', description: '' });
        }}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              required
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project name"
            />
          </div>
          <div>
            <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="projectDescription"
              rows={3}
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project description"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                setNewProject({ name: '', description: '' });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Project
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isEditProjectModalOpen}
        onClose={() => {
          setIsEditProjectModalOpen(false);
          setEditProject({ id: null, name: '', description: '' });
        }}
        title="Edit Project"
      >
        <form onSubmit={handleUpdateProject} className="space-y-4">
          <div>
            <label htmlFor="editProjectName" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              id="editProjectName"
              type="text"
              required
              value={editProject.name}
              onChange={(e) => setEditProject({ ...editProject, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project name"
            />
          </div>
          <div>
            <label htmlFor="editProjectDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="editProjectDescription"
              rows={3}
              value={editProject.description}
              onChange={(e) => setEditProject({ ...editProject, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project description"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsEditProjectModalOpen(false);
                setEditProject({ id: null, name: '', description: '' });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              Update Project
            </Button>
          </div>
        </form>
      </Modal>

      {selectedProject && (
        <CreateTaskModal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
        />
      )}

      <Modal
        isOpen={isViewTasksModalOpen}
        onClose={() => {
          setIsViewTasksModalOpen(false);
          setSelectedProject(null);
        }}
        title={`Tasks in ${selectedProject?.name || 'Project'}`}
        size="lg"
      >
        <div className="space-y-4">
          {selectedProject && (
            <>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Manage all tasks in this project</p>
                <Button
                  onClick={() => {
                    setIsViewTasksModalOpen(false);
                    handleCreateTask(selectedProject);
                  }}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {getProjectTasks(selectedProject.id).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No tasks in this project yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getProjectTasks(selectedProject.id).map((task) => {
                      const assignedUser = allUsers.find(u => u.id === task.assignedTo);
                      return (
                        <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{task.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            </div>
                            <div className="flex space-x-1 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditTask(task)}
                                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                                title="Edit Task"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTask(task.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Delete Task"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <div className="flex space-x-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                task.priority === 'high' 
                                  ? 'bg-red-100 text-red-800'
                                  : task.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {task.priority}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                task.status === 'done' 
                                  ? 'bg-green-100 text-green-800'
                                  : task.status === 'in-progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : task.status === 'hold'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {task.status.replace('-', ' ')}
                              </span>
                            </div>
                            <span className="text-gray-500">
                              Assigned to: {assignedUser?.name || 'Unassigned'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={isEditTaskModalOpen}
        onClose={() => {
          setIsEditTaskModalOpen(false);
          setEditTask({ id: null, title: '', description: '', priority: 'medium', assignedTo: '', status: 'todo' });
        }}
        title="Edit Task"
      >
        <form onSubmit={handleUpdateTask} className="space-y-4">
          <div>
            <label htmlFor="editTaskTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              id="editTaskTitle"
              type="text"
              required
              value={editTask.title}
              onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
            />
          </div>
          <div>
            <label htmlFor="editTaskDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="editTaskDescription"
              rows={3}
              value={editTask.description}
              onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="editTaskPriority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="editTaskPriority"
                value={editTask.priority}
                onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label htmlFor="editTaskStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="editTaskStatus"
                value={editTask.status}
                onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="hold">Hold</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="editTaskAssignedTo" className="block text-sm font-medium text-gray-700 mb-1">
              Assign To
            </label>
            <select
              id="editTaskAssignedTo"
              value={editTask.assignedTo}
              onChange={(e) => setEditTask({ ...editTask, assignedTo: parseInt(e.target.value) || '' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select user...</option>
              {allUsers.filter(user => user.role === 'user').map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsEditTaskModalOpen(false);
                setEditTask({ id: null, title: '', description: '', priority: 'medium', assignedTo: '', status: 'todo' });
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              Update Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectList;
