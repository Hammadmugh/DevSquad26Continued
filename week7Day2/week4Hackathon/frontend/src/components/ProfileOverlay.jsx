import React, { useState, useEffect } from 'react';
import { X, Mail, Zap, Calendar, LogOut } from 'lucide-react';
import { authService } from '../services/authService';

const ProfileOverlay = ({ onClose, onLogout }) => {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Get current user from auth service
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Get subscription from localStorage or API
    const storageSubscription = localStorage.getItem('userSubscription');
    if (storageSubscription) {
      setSubscription(JSON.parse(storageSubscription));
    } else {
      setSubscription(null);
    }
    setLoading(false);
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition"
        onClick={onClose}
      />

      {/* Profile Card */}
      <div className="fixed top-20 right-4 w-80 bg-[#141414] border border-[#262626] rounded-lg shadow-2xl z-50 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#E60000] to-red-900 px-6 py-4 text-white flex items-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center font-bold text-2xl">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">My Account</h2>
            <p className="text-white/80 text-sm mt-1">StreamVibe Premium</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#E60000]"></div>
              <p className="text-gray-400 mt-4 text-sm">Loading...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Email */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Mail size={18} className="text-[#E60000]" />
                  <p className="text-gray-400 text-xs font-semibold uppercase">Email</p>
                </div>
                <p className="text-white text-sm break-all">{user?.email || 'Not provided'}</p>
              </div>

              {/* Subscription Status */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Zap size={18} className="text-[#E60000]" />
                  <p className="text-gray-400 text-xs font-semibold uppercase">Subscription</p>
                </div>
                {subscription && subscription.status === 'active' ? (
                  <div>
                    <p className="text-white text-sm font-semibold">{subscription.planName} Plan</p>
                    <p className="text-gray-400 text-xs mt-1">Active</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-400 text-sm">No active subscription</p>
                    <p className="text-gray-500 text-xs mt-1">Select a plan to get started</p>
                  </div>
                )}
              </div>

              {/* Start Date */}
              {subscription && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar size={18} className="text-[#E60000]" />
                    <p className="text-gray-400 text-xs font-semibold uppercase">Subscribed Since</p>
                  </div>
                  <p className="text-white text-sm">
                    {new Date(subscription.startDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-[#262626]" />

              {/* Role Badge */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded px-3 py-2">
                <p className="text-blue-400 text-xs font-semibold">Role: {user?.role?.toUpperCase() || 'USER'}</p>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 bg-[#E60000] hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition mt-4"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#0a0a0a] px-6 py-4 border-t border-[#262626]">
          <p className="text-gray-500 text-xs text-center">
            Version 1.0 • © 2026 StreamVibe
          </p>
        </div>
      </div>
    </>
  );
};

export default ProfileOverlay;
