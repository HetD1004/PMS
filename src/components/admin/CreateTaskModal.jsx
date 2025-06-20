import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

const CreateTaskModal = ({ isOpen, onClose, project }) => {
  const { createTask, allUsers } = useApp();
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!taskData.title.trim() || !taskData.assignedTo || !taskData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    createTask({
      ...taskData,
      projectId: project.id,
      assignedTo: parseInt(taskData.assignedTo)
    });

    setTaskData({
      title: '',
      description: '',
      dueDate: '',
      assignedTo: ''
    });
    onClose();
  };

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value
    });
  };

  const regularUsers = allUsers.filter(user => user.role === 'user');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Create Task for ${project?.name}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={taskData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={taskData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date *
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              required
              value={taskData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
              Assign to *
            </label>
            <select
              id="assignedTo"
              name="assignedTo"
              required
              value={taskData.assignedTo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a user</option>
              {regularUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit">
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;
