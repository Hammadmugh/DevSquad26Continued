import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Create axios instance with base URL
const api: AxiosInstance = axios.create({
  baseURL: 'https://dev-squad26-week4day1-backend.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== TASK API CALLS ====================

/**
 * Get all tasks (with optional search)
 * @param {string} title - Optional title to search by
 * @returns {Promise} Array of tasks
 */
export const getTasks = (title: string = '') => {
  return api.get('/tasks', {
    params: {
      title,
    },
  });
};

/**
 * Get a specific task by ID
 * @param {string} id - Task ID
 * @returns {Promise} Task object
 */
export const getTask = (id: string) => {
  return api.get(`/tasks/${id}`);
};

/**
 * Create a new task
 * @param {string} title - Task title
 * @param {boolean} completed - Task completion status
 * @returns {Promise} Created task object
 */
export const createTask = (title: string, completed: boolean = false) => {
  return api.post('/tasks', {
    title,
    completed,
  });
};

/**
 * Update a task
 * @param {string} id - Task ID
 * @param {string} title - Updated task title
 * @param {boolean} completed - Updated completion status
 * @returns {Promise} Updated task object
 */
export const updateTask = (id: string, title: string, completed: boolean) => {
  return api.put(`/tasks/${id}`, {
    title,
    completed,
  });
};

/**
 * Delete a task
 * @param {string} id - Task ID
 * @returns {Promise} Deleted task object
 */
export const deleteTask = (id: string) => {
  return api.delete(`/tasks/${id}`);
};

/**
 * Get task statistics (total, completed, pending)
 * @returns {Promise} Stats object with totalTasks, completedTasks, pendingTasks
 */
export const getStats = () => {
  return api.get('/tasks/stats');
};

export default api;