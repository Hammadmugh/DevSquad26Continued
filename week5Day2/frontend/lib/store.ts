// lib/store.ts
import { create } from 'zustand';

interface Comment {
  _id: string;
  author: any;
  content: string;
  likes: number;
  likedBy: string[];
  replies: any[];
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  bio?: string;
  profilePicture?: string;
  followerCount?: number;
  followingCount?: number;
}

interface Notification {
  _id: string;
  sender?: any;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

interface CommentStore {
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  addComment: (comment: Comment) => void;
  updateComment: (id: string, comment: Comment) => void;
  removeComment: (id: string) => void;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  setUnreadCount: (count: number) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, token: null }),
}));

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  setComments: (comments) => set({ comments }),
  addComment: (comment) =>
    set((state) => ({ comments: [comment, ...state.comments] })),
  updateComment: (id, comment) =>
    set((state) => ({
      comments: state.comments.map((c) => (c._id === id ? comment : c)),
    })),
  removeComment: (id) =>
    set((state) => ({
      comments: state.comments.filter((c) => c._id !== id),
    })),
}));

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: !notification.read ? state.unreadCount + 1 : state.unreadCount,
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === id ? { ...n, read: true } : n,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  setUnreadCount: (count) => set({ unreadCount: count }),
}));
