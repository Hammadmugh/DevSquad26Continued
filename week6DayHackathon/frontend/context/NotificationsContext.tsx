"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

const API = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api`;

export type NotificationCategory = "review" | "purchase" | "sale" | "general";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

/** Map a raw DB document (or WS payload) to AppNotification */
function mapNotif(n: any): AppNotification {
  return {
    id: n._notifId ?? n._id?.toString() ?? n.id,
    category: n.category ?? "general",
    title: n.title,
    body: n.body,
    timestamp: new Date(n.createdAt ?? Date.now()),
    read: n.read ?? false,
  };
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // ── Load existing notifications from DB on mount ──
  useEffect(() => {
    fetch(`${API}/notifications`)
      .then((r) => r.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          setNotifications(data.map(mapNotif));
        }
      })
      .catch(() => { /* server offline — start empty */ });
  }, []);

  // ── WebSocket listener for real-time events ──
  useEffect(() => {
    let cleanup = () => {};

    async function connect() {
      try {
        const { io } = await import("socket.io-client");
        const socket = io(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001", { transports: ["websocket"], reconnectionAttempts: 3 });

        const addFromSocket = (data: any) => {
          setNotifications((prev) => {
            // Avoid duplicates if the notification was already fetched from DB
            if (prev.some((n) => n.id === (data._notifId ?? data._id))) return prev;
            return [mapNotif(data), ...prev].slice(0, 50);
          });
        };

        socket.on("new_review", addFromSocket);
        socket.on("purchase_made", addFromSocket);
        socket.on("sale_started", addFromSocket);

        cleanup = () => socket.disconnect();
      } catch {
        // Socket.IO not available or server offline — fail silently
      }
    }

    connect();
    return () => cleanup();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    fetch(`${API}/notifications/read-all`, { method: "PATCH" }).catch(() => {});
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    fetch(`${API}/notifications/${id}/read`, { method: "PATCH" }).catch(() => {});
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    fetch(`${API}/notifications`, { method: "DELETE" }).catch(() => {});
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAllRead, markRead, clearAll }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}

