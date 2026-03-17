import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { getTasks, getStats } from '../services/Api';

interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

interface Stats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({ totalTasks: 0, completedTasks: 0, pendingTasks: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTitle, setSearchTitle] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  const fetchTasks = async (title = '') => {
    setLoading(true);
    setError('');
    try {
      const response = await getTasks(title);
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
    fetchStats();
  };

  const handleTasksChange = (data: any) => {
    if (data.removed) {
      // Task was deleted
      setTasks(tasks.filter((t) => t._id !== data.id));
    } else {
      // Task was updated
      setTasks(tasks.map((t) => (t._id === data._id ? data : t)));
    }
    fetchStats();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setSearchTitle(title);
    fetchTasks(title);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">TaskMaster</h1>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-gray-800">{stats.completedTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="shrink-0">
                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-gray-800">{stats.pendingTasks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Task Form */}
        <TaskForm onTaskCreated={handleTaskCreated} />

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={searchTitle}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Task List */}
        <TaskList tasks={tasks} onTasksChange={handleTasksChange} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;