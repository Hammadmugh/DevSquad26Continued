'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, useNotificationStore } from '@/lib/store';
import { initSocket, on, off } from '@/lib/socket';
import Navbar from '@/components/Navbar';
import { apiClient, notificationAPI } from '@/lib/api';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);
  const [mounted, setMounted] = useState(false);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken && !token) {
      setToken(savedToken);
    }
    setMounted(true);
  }, [token, setToken]);

  // Initialize WebSocket and fetch user profile when token is available
  useEffect(() => {
    if (!token || !mounted) return;

    // Initialize WebSocket
    const socket = initSocket(token);

    // Fetch initial notifications
    fetchInitialNotifications();

    // Fetch user profile
    fetchUserProfile();

    // Listen for real-time notifications
    on('notification:received', (notification) => {
      console.log('📬 Notification received on frontend:', notification);
      addNotification(notification);
    });



    return () => {
      off('notification:received');
    };
  }, [token, mounted, addNotification, setNotifications, setUnreadCount]);

  const fetchInitialNotifications = async () => {
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.data);
      
      // Calculate unread count
      const unreadCount = response.data.filter((n: any) => !n.read).length;
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get('/users/profile');
      // Map _id from backend to id for frontend
      setUser({
        ...response.data,
        id: response.data._id,
      });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {token && <Navbar />}
      <main className={token ? 'pt-16' : ''}>{children}</main>
    </>
  );
}
