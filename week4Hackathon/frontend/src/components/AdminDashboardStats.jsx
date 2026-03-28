import React from 'react';

const AdminDashboardStats = ({ stats, onRefresh }) => {
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      bgClass: 'bg-neutral-800 border-neutral-700',
    },
    {
      title: 'Admin Users',
      value: stats.totalAdmins,
      icon: '👨‍💼',
      bgClass: 'bg-neutral-800 border-neutral-700',
    },
    {
      title: 'Regular Users',
      value: stats.totalRegularUsers,
      icon: '👤',
      bgClass: 'bg-neutral-800 border-neutral-700',
    },
    {
      title: 'Total Movies',
      value: stats.totalMovies,
      icon: '🎬',
      bgClass: 'bg-neutral-800 border-neutral-700',
    },
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className={`${card.bgClass} border rounded-xl p-6 text-white shadow-lg hover:border-neutral-600 transition`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-neutral-300 text-sm opacity-90">{card.title}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <span className="text-4xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={onRefresh}
          className="bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-white font-semibold px-6 py-2 rounded-xl transition"
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
};

export default AdminDashboardStats;
