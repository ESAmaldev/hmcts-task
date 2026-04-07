import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { taskService } from '../services/api';

const TaskForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'PENDING',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await taskService.getTaskById(id);
      const task = response.data.data;
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        dueDate: task.dueDate.slice(0, 16), // Format for datetime-local input
      });
    } catch (error) {
      toast.error('Failed to fetch task');
      navigate('/');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.dueDate) {
      toast.error('Due date is required');
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        await taskService.updateTask(id, formData);
        toast.success('Task updated successfully');
      } else {
        await taskService.createTask(formData);
        toast.success('Task created successfully');
      }
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save task';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
        {isEditing ? 'Edit Task' : 'Create New Task'}
      </h1>
      <form onSubmit={handleSubmit} className="bg-white/90 rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2 text-lg">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/60 text-lg"
            placeholder="Enter task title"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2 text-lg">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/60 text-lg"
            placeholder="Enter task description (optional)"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2 text-lg">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/60 text-lg"
          >
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-2 text-lg">
            Due Date/Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/60 text-lg"
            required
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold text-lg shadow hover:bg-gray-300 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;