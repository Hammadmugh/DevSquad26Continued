// utils/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email: string, password: string, username: string) =>
    apiClient.post('/auth/register', { email, password, username }),
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
};

export const userAPI = {
  getProfile: () => apiClient.get('/users/profile'),
  getUser: (id: string) => apiClient.get(`/users/${id}`),
  getAllUsers: () => apiClient.get('/users'),
  updateProfile: (id: string, data: any) =>
    apiClient.patch(`/users/${id}`, data),
};

export const commentAPI = {
  getAll: () => apiClient.get('/comments'),
  getOne: (id: string) => apiClient.get(`/comments/${id}`),
  create: (content: string) =>
    apiClient.post('/comments', { content }),
  update: (id: string, content: string) =>
    apiClient.patch(`/comments/${id}`, { content }),
  delete: (id: string) => apiClient.delete(`/comments/${id}`),
  addReply: (commentId: string, content: string) =>
    apiClient.post(`/comments/${commentId}/replies`, { content }),
  getReplies: (commentId: string) =>
    apiClient.get(`/comments/${commentId}/replies`),
};

export const likeAPI = {
  like: (commentId: string) =>
    apiClient.post('/likes', { commentId }),
  unlike: (commentId: string) =>
    apiClient.delete(`/likes/${commentId}`),
  getCommentLikes: (commentId: string) =>
    apiClient.get(`/likes/${commentId}`),
  isLiked: (commentId: string) =>
    apiClient.get(`/likes/${commentId}/is-liked`),
};

export const followerAPI = {
  follow: (userId: string) =>
    apiClient.post(`/followers/${userId}/follow`),
  unfollow: (userId: string) =>
    apiClient.delete(`/followers/${userId}/unfollow`),
  getFollowers: (userId: string) =>
    apiClient.get(`/followers/${userId}/followers`),
  getFollowing: (userId: string) =>
    apiClient.get(`/followers/${userId}/following`),
  isFollowing: (userId: string, targetId: string) =>
    apiClient.get(`/followers/${userId}/is-following/${targetId}`),
};

export const notificationAPI = {
  getAll: () => apiClient.get('/notifications'),
  getUnread: () => apiClient.get('/notifications/unread'),
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),
  markAsRead: (id: string) =>
    apiClient.patch(`/notifications/${id}`),
  markAllAsRead: () =>
    apiClient.patch('/notifications/mark-all-read', {}),
  delete: (id: string) => apiClient.delete(`/notifications/${id}`),
  deleteAll: () => apiClient.delete('/notifications'),
};
