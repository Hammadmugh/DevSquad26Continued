"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface OrderItem {
  name: string;
  image?: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface Order {
  _id: string;
  status: string;
  paymentMethod?: string;
  paymentStatus?: string;
  totalMoney: number;
  totalPointsSpent: number;
  pointsEarned: number;
  items: OrderItem[];
  createdAt: string;
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  stripe: "Card",
  points: "Points",
  free: "Free",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function UserProfileOverlay() {
  const { user, token, isProfileOpen, closeProfile, logout, openAuthModal } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    if (!isProfileOpen || !token) return;
    setOrdersLoading(true);
    setOrdersError("");
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load orders");
        return r.json();
      })
      .then((data) => setOrders(data))
      .catch((e) => setOrdersError(e.message))
      .finally(() => setOrdersLoading(false));
  }, [isProfileOpen, token]);

  if (!isProfileOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end" style={{ fontFamily: "'Satoshi', sans-serif" }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeProfile}
      />

      {/* Panel */}
      <div className="relative w-full max-w-[420px] h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
          <div
            className="text-black font-extrabold text-[18px] tracking-tight"
            style={{ fontFamily: "'Integral CF', sans-serif" }}
          >
            SHOP.CO
          </div>
          <button
            onClick={closeProfile}
            aria-label="Close"
            className="text-black/40 hover:text-black transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {user ? (
            <>
              {/* User Info */}
              <div className="px-6 py-6 border-b border-black/10">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full shrink-0 overflow-hidden bg-black text-white flex items-center justify-center text-[22px] font-bold">
                    {user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-[18px] text-black">{user.name}</span>
                    <span className="text-sm text-black/50">{user.email}</span>
                    <span className="text-xs text-black/40 capitalize">{user.role}</span>
                  </div>
                </div>

                {/* Loyalty Points */}
                <div className="mt-4 flex items-center gap-3 bg-[#F0F7FF] border border-[#B8D9FF] rounded-[12px] px-4 py-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                    <path d="M10 1L12.39 6.26L18 7.27L14 11.14L14.76 17L10 14.27L5.24 17L6 11.14L2 7.27L7.61 6.26L10 1Z" fill="#2563EB" stroke="#2563EB" strokeWidth="0.5" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <span className="text-[13px] text-[#1D4ED8] font-semibold">
                      {user.loyaltyPoints} Loyalty Points
                    </span>
                    <p className="text-[11px] text-[#3B82F6] mt-0.5">Earn points on every purchase</p>
                  </div>
                </div>
              </div>

              {/* Orders */}
              <div className="px-6 py-5">
                <h3 className="font-bold text-[18px] text-black mb-4">Order History</h3>

                {ordersLoading && (
                  <div className="flex flex-col gap-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-24 bg-[#F0F0F0] rounded-[12px] animate-pulse" />
                    ))}
                  </div>
                )}

                {ordersError && (
                  <div className="text-sm text-[#FF3333] bg-[#FFF0F0] border border-[#FFB3B3] rounded-[12px] px-4 py-3">
                    {ordersError}
                  </div>
                )}

                {!ordersLoading && !ordersError && orders.length === 0 && (
                  <div className="flex flex-col items-center gap-3 py-10 text-center">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <rect x="8" y="12" width="32" height="36" rx="4" stroke="#D1D5DB" strokeWidth="2" />
                      <path d="M16 12V9C16 7.34315 17.3431 6 19 6H29C30.6569 6 32 7.34315 32 9V12" stroke="#D1D5DB" strokeWidth="2" />
                      <path d="M16 22H32M16 30H24" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <p className="text-black/40 text-sm">No orders yet</p>
                  </div>
                )}

                {!ordersLoading && orders.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-black/10 rounded-[16px] p-4 flex flex-col gap-3"
                      >
                        {/* Order header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs text-black/40 font-mono">
                              #{order._id.slice(-8).toUpperCase()}
                            </span>
                            <span className="text-xs text-black/40">
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <span
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}
                          >
                            {order.status}
                          </span>
                        </div>

                        {/* Items preview */}
                        <div className="flex flex-col gap-1">
                          {order.items.slice(0, 2).map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-black/70">
                              <span className="w-1.5 h-1.5 rounded-full bg-black/30 shrink-0" />
                              <span className="truncate">
                                {item.name}
                                {item.size && <span className="text-black/40"> · {item.size}</span>}
                              </span>
                              <span className="ml-auto shrink-0 font-medium text-black">
                                ×{item.quantity}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <span className="text-xs text-black/40 ml-3.5">
                              +{order.items.length - 2} more items
                            </span>
                          )}
                        </div>

                        {/* Payment info */}
                        {(order.paymentMethod || order.paymentStatus) && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {order.paymentMethod && (
                              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-black/5 text-black/60 capitalize">
                                {PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}
                              </span>
                            )}
                            {order.paymentStatus && (
                              <span
                                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                                  PAYMENT_STATUS_COLORS[order.paymentStatus] ?? "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {order.paymentStatus}
                              </span>
                            )}
                            {order.pointsEarned > 0 && (
                              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                                +{order.pointsEarned} pts
                              </span>
                            )}
                          </div>
                        )}

                        {/* Order total */}
                        <div className="flex items-center justify-between pt-2 border-t border-black/10">
                          <span className="text-sm text-black/50">Total</span>
                          <span className="font-bold text-black">${order.totalMoney}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Guest state */
            <div className="flex flex-col items-center gap-5 px-8 py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F0F0F0] flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M26.667 28V25.333C26.667 23.919 26.105 22.563 25.105 21.562C24.104 20.562 22.748 20 21.333 20H10.667C9.252 20 7.896 20.562 6.896 21.562C5.895 22.563 5.333 23.919 5.333 25.333V28" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="16" cy="9.333" r="5.333" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[18px] text-black mb-2">Sign in to view your profile</h3>
                <p className="text-sm text-black/50">Access your orders, loyalty points, and more.</p>
              </div>
              <button
                onClick={() => { closeProfile(); openAuthModal("login"); }}
                className="bg-black text-white font-medium text-base rounded-full px-8 py-3 hover:opacity-80 transition-opacity"
              >
                Sign In
              </button>
              <button
                onClick={() => { closeProfile(); openAuthModal("register"); }}
                className="text-black font-medium text-sm underline hover:opacity-70 transition-opacity"
              >
                Create an account
              </button>
            </div>
          )}
        </div>

        {/* Footer: logout */}
        {user && (
          <div className="px-6 py-4 border-t border-black/10">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 text-sm text-black/50 hover:text-black transition-colors py-2"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M6.75 15.75H3.75C3.352 15.75 2.97 15.592 2.689 15.311C2.408 15.03 2.25 14.648 2.25 14.25V3.75C2.25 3.352 2.408 2.97 2.689 2.689C2.97 2.408 3.352 2.25 3.75 2.25H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 12.75L15.75 9L12 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.75 9H6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
