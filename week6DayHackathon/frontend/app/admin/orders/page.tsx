"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type OrderItem = {
  name: string;
  image?: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
};

type Order = {
  _id: string;
  userId: { _id: string; name: string; email: string } | string;
  items: OrderItem[];
  totalMoney: number;
  status: string;
  createdAt: string;
};

const STATUS_CONFIG: Record<string, { dot: string; label: string }> = {
  pending:   { dot: "#9CA3AF", label: "Pending" },
  paid:      { dot: "#22C55E", label: "Paid" },
  shipped:   { dot: "#0EA5E9", label: "Shipped" },
  delivered: { dot: "#003F62", label: "Delivered" },
  cancelled: { dot: "#FFA52F", label: "Cancelled" },
};

const ALL_STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];
const PAGE_SIZE = 8;

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      setOrders(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered =
    filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function getCustomerName(order: Order): string {
    if (typeof order.userId === "object" && order.userId?.name) return order.userId.name;
    return "User";
  }

  function formatDate(iso: string): string {
    const d = new Date(iso);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const day = d.getDate();
    const suffix = day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";
    return `${months[d.getMonth()]} ${day}${suffix}, ${d.getFullYear()}`;
  }

  const pageNums: (number | "...")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pageNums.push(i);
  } else {
    pageNums.push(1, 2, 3, 4, "...", totalPages);
  }

  const activeFilterLabel =
    filterStatus === "all"
      ? "Change Status"
      : STATUS_CONFIG[filterStatus]?.label ?? filterStatus;

  return (
    <div className="flex flex-col gap-6">
      {/* Sub header */}
      <div className="flex flex-row justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1
            className="text-2xl font-semibold"
            style={{ fontFamily: "'Rubik'", color: "#000" }}
          >
            Orders List
          </h1>
          <span
            className="text-base font-semibold"
            style={{ fontFamily: "'Open Sans'", color: "#000", opacity: 0.8 }}
          >
            Home &gt; Order List
          </span>
        </div>

        {/* Date / count indicator */}
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="2.25" y="3.75" width="19.5" height="18" rx="2" stroke="#232321" strokeWidth="1.5" />
            <path d="M6 2.25V5.25M18 2.25V5.25" stroke="#232321" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M2.25 9.75H21.75" stroke="#232321" strokeWidth="1.5" />
          </svg>
          <span
            className="text-base font-semibold"
            style={{ fontFamily: "'Open Sans'", color: "#000" }}
          >
            {orders.length > 0 ? `${orders.length} total orders` : "No orders yet"}
          </span>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex justify-end">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className="flex items-center gap-4 px-4 py-4 rounded-lg"
            style={{ background: "#F4F2F2" }}
          >
            <span
              className="font-semibold text-sm"
              style={{ fontFamily: "'Open Sans'", color: "#232321" }}
            >
              {activeFilterLabel}
            </span>
            <svg
              width="20" height="20" viewBox="0 0 20 20" fill="none"
              className={`transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`}
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="#232321" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </button>

          {filterOpen && (
            <div
              className="absolute right-0 top-full mt-1 z-20 rounded-lg shadow-lg overflow-hidden"
              style={{
                background: "#fff",
                border: "1px solid rgba(35,35,33,0.15)",
                minWidth: "180px",
              }}
            >
              <button
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-black/5 transition-colors font-semibold"
                style={{ fontFamily: "'Open Sans'" }}
                onClick={() => { setFilterStatus("all"); setFilterOpen(false); setPage(1); }}
              >
                All Orders
              </button>
              {ALL_STATUSES.map((s) => (
                <button
                  key={s}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-black/5 transition-colors flex items-center gap-2"
                  style={{ fontFamily: "'Open Sans'" }}
                  onClick={() => { setFilterStatus(s); setFilterOpen(false); setPage(1); }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: STATUS_CONFIG[s]?.dot ?? "#999" }}
                  />
                  {STATUS_CONFIG[s]?.label ?? s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table card */}
      <div
        className="flex flex-col gap-4 p-6 rounded-2xl"
        style={{ background: "#F8F8F8" }}
      >
        {/* Card heading */}
        <div className="flex items-center justify-between">
          <span
            className="text-xl font-semibold"
            style={{ fontFamily: "'Rubik'", color: "#000" }}
          >
            Recent Purchases
          </span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.5" fill="#000" />
            <circle cx="12" cy="12" r="1.5" fill="#000" />
            <circle cx="12" cy="19" r="1.5" fill="#000" />
          </svg>
        </div>

        {/* Divider */}
        <div style={{ borderBottom: "0.5px solid rgba(35,35,33,0.2)" }} />

        {/* Column headers */}
        <div
          className="flex items-end justify-between text-sm pb-1"
          style={{ borderBottom: "0.5px solid rgba(35,35,33,0.2)" }}
        >
          {/* Product column (checkbox + name) */}
          <div className="flex items-end gap-2 w-[186px]">
            <div className="w-9 px-2 py-4" />
            <div className="px-2 py-4">
              <span
                className="font-semibold text-base"
                style={{ fontFamily: "'Rubik'", color: "rgba(35,35,33,0.8)" }}
              >
                Product
              </span>
            </div>
          </div>

          <div className="flex flex-1 justify-between items-end">
            {[
              { label: "Order ID",      w: "w-20" },
              { label: "Date",          w: "w-24" },
              { label: "Customer Name", w: "w-36" },
              { label: "Status",        w: "w-[84px]" },
              { label: "Amount",        w: "w-[84px]" },
              { label: "Update",        w: "w-28" },
            ].map(({ label, w }) => (
              <div key={label} className={`${w} text-center px-2 py-4`}>
                <span
                  className="font-semibold text-base"
                  style={{ fontFamily: "'Rubik'", color: "rgba(35,35,33,0.8)" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="py-10 text-center text-black/40 text-sm">Loading orders…</div>
        ) : paginated.length === 0 ? (
          <div className="py-10 text-center text-black/40 text-sm">No orders found.</div>
        ) : (
          paginated.map((order) => {
            const sc = STATUS_CONFIG[order.status] ?? { dot: "#9CA3AF", label: order.status };
            const firstItem = order.items[0];
            const shortId = order._id.slice(-6).toUpperCase();
            const customer = getCustomerName(order);

            return (
              <div
                key={order._id}
                className="flex items-center justify-between cursor-pointer hover:bg-black/[0.02] rounded-lg transition-colors"
                style={{ borderBottom: "0.5px solid rgba(35,35,33,0.2)", paddingBottom: "4px" }}
                onClick={() => router.push(`/admin/orders/${order._id}`)}
              >
                {/* Product */}
                <div className="flex items-center gap-2 w-[186px]">
                  <div className="w-9 px-2 py-2">
                    <input
                      type="checkbox"
                      className="w-5 h-5 opacity-75 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="px-2 py-2 flex-1 min-w-0">
                    <span
                      className="font-semibold text-sm block truncate"
                      style={{ fontFamily: "'Open Sans'", color: "#000" }}
                    >
                      {firstItem?.name ?? "—"}
                      {order.items.length > 1 && (
                        <span className="text-xs text-black/40 ml-1">
                          +{order.items.length - 1}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 justify-between items-center">
                  {/* Order ID */}
                  <div className="w-20 text-center px-2 py-2">
                    <span
                      className="font-semibold text-sm"
                      style={{ fontFamily: "'Open Sans'", color: "#000" }}
                    >
                      #{shortId}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="w-24 text-center px-2 py-2">
                    <span
                      className="font-semibold text-sm"
                      style={{ fontFamily: "'Open Sans'", color: "#000" }}
                    >
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  {/* Customer */}
                  <div className="w-36 flex items-center justify-center gap-2 px-2 py-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold shrink-0"
                      style={{ background: "#003F62" }}
                    >
                      {customer.charAt(0).toUpperCase()}
                    </div>
                    <span
                      className="font-semibold text-sm truncate"
                      style={{ fontFamily: "'Open Sans'", color: "#000" }}
                    >
                      {customer}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="w-[84px] flex items-center justify-center gap-1.5 px-2 py-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: sc.dot }}
                    />
                    <span
                      className="font-semibold text-sm"
                      style={{ fontFamily: "'Open Sans'", color: "#000" }}
                    >
                      {sc.label}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="w-[84px] text-center px-2 py-2">
                    <span
                      className="font-semibold text-sm"
                      style={{ fontFamily: "'Open Sans'", color: "#000" }}
                    >
                      ${order.totalMoney.toFixed(2)}
                    </span>
                  </div>

                  {/* Status select */}
                  <div className="w-28 px-2 py-2">
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) => { e.stopPropagation(); handleStatusChange(order._id, e.target.value); }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full text-xs px-2 py-1.5 rounded-lg border border-black/15 bg-white font-semibold cursor-pointer focus:outline-none disabled:opacity-50 transition-opacity"
                      style={{ fontFamily: "'Open Sans'", color: "#232321" }}
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_CONFIG[s]?.label ?? s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-2">
            {pageNums.map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="text-sm font-medium px-1"
                  style={{ color: "#232321", fontFamily: "'Inter'" }}
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className="flex items-center justify-center rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: page === p ? "#232321" : "transparent",
                    color: page === p ? "#FFFFFF" : "#232321",
                    border: page === p ? "none" : "1px solid #232321",
                    minWidth: "32px",
                    height: "32px",
                    padding: "8px 16px",
                    fontFamily: "'Inter'",
                    letterSpacing: "0.25px",
                  }}
                >
                  {p}
                </button>
              )
            )}
            {page < totalPages && (
              <button
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 rounded-lg text-sm font-medium"
                style={{
                  border: "1px solid #232321",
                  color: "#232321",
                  fontFamily: "'Inter'",
                  letterSpacing: "0.25px",
                  height: "32px",
                  padding: "8px 16px",
                }}
              >
                Next
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="#232321" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
