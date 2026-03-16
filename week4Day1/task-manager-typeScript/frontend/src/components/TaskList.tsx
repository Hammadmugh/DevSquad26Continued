import { useState } from 'react';
import type { AxiosError } from 'axios';
import { updateTask, deleteTask } from '../services/Api';

interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

const TaskList = ({ tasks, onTasksChange, loading }: { tasks: Task[]; onTasksChange: (data: any) => void; loading: boolean }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleEdit = (task: Task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setError('');
  };

  const handleSaveEdit = async (taskId: string, completed: boolean) => {
    if (!editTitle.trim()) {
      setError('Task title cannot be empty');
      return;
    }
    if (editTitle.trim().length < 3) {
      setError('Task must be at least 3 characters');
      return;
    }

    setUpdatingId(taskId);
    setError('');
    try {
      const response = await updateTask(taskId, editTitle.trim(), completed);
      if (response.data.success) {
        onTasksChange(response.data.data);
        setEditingId(null);
        setEditTitle('');
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to update task');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    setUpdatingId(task._id);
    setError('');
    try {
      const response = await updateTask(task._id, task.title, !task.completed);
      if (response.data.success) {
        onTasksChange(response.data.data);
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to update task');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    setDeletingId(taskId);
    setError('');
    try {
      const response = await deleteTask(taskId);
      if (response.data.success) {
        // Remove task from list
        onTasksChange({ removed: true, id: taskId });
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to delete task');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-gray-500 text-lg">No tasks yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Task Items */}
      {tasks.map((task: Task) => (
        <div
          key={task._id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-200"
        >
          <div className="flex items-center gap-3">
            {/* Checkbox */}
            <button
              onClick={() => handleToggleComplete(task)}
              disabled={updatingId === task._id}
              className={`shrink-0 h-6 w-6 rounded border-2 flex items-center justify-center transition ${
                task.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 hover:border-green-500'
              } disabled:opacity-50`}
            >
              {task.completed && (
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Task Content */}
            <div className="flex-1 min-w-0">
              {editingId === task._id ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => {
                    setEditTitle(e.target.value);
                    setError('');
                  }}
                  className="w-full px-3 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <p
                  className={`text-gray-800 break-word ${
                    task.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  {task.title}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 shrink-0">
              {editingId === task._id ? (
                <>
                  <button
                    onClick={() => handleSaveEdit(task._id, task.completed)}
                    disabled={updatingId === task._id}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded text-sm transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(task)}
                    disabled={updatingId === task._id || deletingId === task._id}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    disabled={deletingId === task._id || updatingId === task._id}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-3 py-1 rounded text-sm transition"
                  >
                    {deletingId === task._id ? 'Deleting...' : 'Delete'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;