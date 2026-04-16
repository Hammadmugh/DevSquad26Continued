import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { AxiosError } from 'axios';
import { createTask } from '../services/Api';

const TaskForm = ({ onTaskCreated }: { onTaskCreated: (task: any) => void }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const onSubmit = async (data: { title: string }) => {
    setLoading(true);
    setApiError('');
    try {
      const response = await createTask(data.title, false);
      if (response.data.success) {
        reset();
        onTaskCreated(response.data.data);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setApiError(axiosError.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Task</h2>
      
      {/* API Error Message */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {apiError}
        </div>
      )}

      <div className="flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Enter task title..."
            {...register('title', {
              required: 'Task title is required',
              minLength: {
                value: 3,
                message: 'Task must be at least 3 characters',
              },
              maxLength: {
                value: 100,
                message: 'Task must not exceed 100 characters',
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center whitespace-nowrap"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </>
          ) : (
            '+ Add Task'
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;