import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboardStats from '../components/AdminDashboardStats';
import AdminUsersTable from '../components/AdminUsersTable';
import AdminUploadMovie from '../components/AdminUploadMovie';
import AdminMoviesList from '../components/AdminMoviesList';
import { adminService } from '../services/adminService';
import { authService } from '../services/authService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const statsData = await adminService.getDashboardStats();
      setStats(statsData.data);

      if (activeTab === 'users') {
        const usersData = await adminService.getAllUsers();
        setUsers(usersData.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    if (tab === 'users') {
      try {
        const usersData = await adminService.getAllUsers();
        setUsers(usersData.data);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="StreamVibe" className="h-8" />
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-neutral-400 text-sm mt-1">Welcome, {authService.getCurrentUser()?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-white font-semibold px-6 py-2 rounded-xl transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500/50 text-white px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-neutral-800">
          <button
            onClick={() => handleTabChange('overview')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'overview'
                ? 'text-white border-b-2 border-neutral-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleTabChange('users')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'users'
                ? 'text-white border-b-2 border-neutral-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Users Management
          </button>
          <button
            onClick={() => handleTabChange('upload')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'upload'
                ? 'text-white border-b-2 border-neutral-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Upload Content
          </button>
          <button
            onClick={() => handleTabChange('movies')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'movies'
                ? 'text-white border-b-2 border-neutral-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Movies & Shows
          </button>
        </div>

        {/* Content */}
        {loading && activeTab !== 'upload' ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-400"></div>
            <p className="text-neutral-400 mt-4">Loading data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && stats && (
              <AdminDashboardStats stats={stats} onRefresh={handleRefresh} />
            )}
            {activeTab === 'users' && (
              <AdminUsersTable users={users} onRefresh={handleRefresh} />
            )}
            {activeTab === 'upload' && (
              <AdminUploadMovie onSuccess={() => {
                // Refresh stats after successful upload
                if (activeTab === 'upload') {
                  handleRefresh();
                }
              }} />
            )}
            {activeTab === 'movies' && (
              <AdminMoviesList onRefresh={handleRefresh} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
