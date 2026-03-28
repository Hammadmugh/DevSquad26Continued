import React, { useState } from 'react';
import { adminService } from '../services/adminService';

const AdminUsersTable = ({ users: initialUsers, onRefresh }) => {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        await adminService.deleteUser(userId);
        setUsers(users.filter(u => u._id !== userId));
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      setLoading(true);
      await adminService.updateUserRole(userId, newRole);
      setUsers(users.map(u => 
        u._id === userId ? { ...u, role: newRole } : u
      ));
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
      {error && (
        <div className="bg-red-500 bg-opacity-10 border-b border-red-500/50 text-red-400 px-6 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral-800 border-b border-neutral-700">
            <tr>
              <th className="px-6 py-4 text-left text-neutral-300 font-semibold">Email</th>
              <th className="px-6 py-4 text-left text-neutral-300 font-semibold">Role</th>
              <th className="px-6 py-4 text-left text-neutral-300 font-semibold">Joined</th>
              <th className="px-6 py-4 text-left text-neutral-300 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-neutral-800/50 transition">
                <td className="px-6 py-4 text-white">{user.email}</td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleChangeRole(user._id, e.target.value)}
                    disabled={loading}
                    className="bg-neutral-800 text-white px-3 py-1 rounded-lg border border-neutral-700 focus:outline-none focus:border-neutral-600 text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-neutral-400 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    disabled={loading}
                    className="bg-neutral-900 border border-neutral-700 hover:border-neutral-600 disabled:opacity-50 text-white px-4 py-1 rounded-lg transition text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-400">No users found</p>
        </div>
      )}

      <div className="bg-neutral-800 px-6 py-4 border-t border-neutral-700 flex justify-between items-center">
        <p className="text-neutral-300">Total Users: <span className="font-semibold">{users.length}</span></p>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="bg-neutral-900 border border-neutral-700 hover:border-neutral-600 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition"
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default AdminUsersTable;
