const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message: string }).message ?? 'Request failed');
  }
  return res.json() as Promise<T>;
}

/* ── Auth ──────────────────────────────────────────────────── */
export const api = {
  auth: {
    register: (data: { fullName: string; email: string; password: string; mobile?: string }) =>
      request<{ token: string; user: Record<string, unknown> }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

    login: (data: { email: string; password: string }) =>
      request<{ token: string; user: Record<string, unknown> }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  },

  /* ── User / Profile ──────────────────────────────────────── */
  users: {
    getProfile: () => request<Record<string, unknown>>('/users/me'),
    getPublicProfile: (id: string) => request<Record<string, unknown>>(`/users/${id}/public`),
    updateProfile: (data: Record<string, string>) =>
      request<Record<string, unknown>>('/users/me', { method: 'PUT', body: JSON.stringify(data) }),
    getWishlist: () => request<unknown[]>('/users/me/wishlist'),
    addToWishlist: (auctionId: string) =>
      request<{ message: string }>(`/users/me/wishlist/${auctionId}`, { method: 'POST' }),
    removeFromWishlist: (auctionId: string) =>
      request<{ message: string }>(`/users/me/wishlist/${auctionId}`, { method: 'DELETE' }),
    getMyCars: () => request<unknown[]>('/users/me/cars'),
    getMyBids: () => request<unknown[]>('/users/me/bids'),
  },

  /* ── Auctions ────────────────────────────────────────────── */
  auctions: {
    getAll: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ data: unknown[]; total: number; page: number; totalPages: number }>(`/auctions${qs}`);
    },
    getLive: () => request<unknown[]>('/auctions/live'),
    getOne: (id: string) => request<Record<string, unknown>>(`/auctions/${id}`),
    getBids: (id: string) => request<unknown[]>(`/auctions/${id}/bids`),
    create: (data: Record<string, unknown>) =>
      request<Record<string, unknown>>('/auctions', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      request<Record<string, unknown>>(`/auctions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    endBid: (id: string) =>
      request<Record<string, unknown>>(`/auctions/${id}/end`, { method: 'PATCH' }),
    delete: (id: string) =>
      request<Record<string, unknown>>(`/auctions/${id}`, { method: 'DELETE' }),
    placeBid: (id: string, amount: number) =>
      request<Record<string, unknown>>(`/auctions/${id}/bids`, { method: 'POST', body: JSON.stringify({ amount }) }),
  },

  /* ── Payments ────────────────────────────────────────────── */
  payments: {
    pay: (auctionId: string) =>
      request<Record<string, unknown>>(`/payments/${auctionId}`, { method: 'POST' }),
    getStatus: (auctionId: string) =>
      request<Record<string, unknown>>(`/payments/${auctionId}/status`),
  },

  /* ── Notifications ───────────────────────────────────────── */
  notifications: {
    getAll: () => request<Record<string, unknown>[]>('/notifications'),
    markAllRead: () => request<void>('/notifications/read-all', { method: 'PATCH' }),
    clearAll: () => request<void>('/notifications', { method: 'DELETE' }),
  },
};
