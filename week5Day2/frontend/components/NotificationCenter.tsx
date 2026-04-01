'use client';

import { useState, useEffect } from 'react';
import { notificationAPI } from '@/lib/api';
import { useNotificationStore } from '@/lib/store';
import { on, off } from '@/lib/socket';

interface Notification {
  _id: string;
  sender?: any;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationCenter() {
  const [showPanel, setShowPanel] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

  // Load initial notifications on mount
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const response = await notificationAPI.getAll();
        setNotifications(response.data || []);
        setError(null);
        
        // Get unread count
        const countResponse = await notificationAPI.getUnreadCount();
        setUnreadCount(countResponse.data.unreadCount);
      } catch (err) {
        console.error('Failed to load notifications:', err);
        setError('Failed to load notifications');
      } finally {
        setLoadingNotifications(false);
      }
    };

    loadNotifications();
  }, [setNotifications, setUnreadCount]);

  const handleMarkAsRead = async (id: string) => {
    try {
      setError(null);
      await notificationAPI.markAsRead(id);
      markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      setError('Failed to mark as read');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await notificationAPI.delete(id);
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
      setError('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'REPLY':
        return '💬';
      case 'LIKE':
        return '❤️';
      case 'FOLLOW':
        return '👤';
      case 'COMMENT':
        return '📝';
      default:
        return '📢';
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 text-2xl hover:bg-gray-100 rounded-full transition"
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-b border-gray-200">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <p className="text-sm opacity-90">{unreadCount} unread</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="px-4 py-2 bg-red-50 border-b border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loadingNotifications ? (
              <div className="flex items-center justify-center h-40 text-gray-400">
                <p>Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-gray-400">
                <div className="text-center">
                  <p className="text-lg">📭</p>
                  <p>No notifications yet</p>
                </div>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="text-2xl flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {notification.sender?.username || 'System'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 break-words">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex gap-2 ml-2">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="p-1 text-gray-400 hover:text-blue-500 transition"
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop to close panel */}
      {showPanel && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowPanel(false)}
        />
      )}
    </div>
  );
}
