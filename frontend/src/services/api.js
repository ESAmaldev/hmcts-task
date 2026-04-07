import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  getAllTasks: () => api.get('/tasks'),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (task) => api.post('/tasks', task),
  updateTask: (id, task) => api.put(`/tasks/${id}`, task),
  updateTaskStatus: (id, status) => api.put(`/tasks/${id}/status?status=${status}`),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getTasksByStatus: (status) => api.get(`/tasks/status/${status}`),
};

export default api;