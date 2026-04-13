"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type OrderItem = {
  name: string;
  image?: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
};

type OrderUser = {
  _id: string;
  name: string;
  email: string;
};

type ShippingAddress = {
  fullName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

type Order = {
  _id: string;
  userId: OrderUser | string;
  items: OrderItem[];
  totalMoney: number;
  discount?: number;
  status: string;
  createdAt: string;
  shippingAddress?: ShippingAddress;
};

const STATUS_CONFIG: Record<string, { dot: string; label: string; badge: string }> = {
  pending:   { dot: "#9CA3AF", label: "Pending",   badge: "rgba(255,165,47,0.8)" },
  paid:      { dot: "#22C55E", label: "Paid",      badge: "rgba(34,197,94,0.8)" },
  shipped:   { dot: "#0EA5E9", label: "Shipped",   badge: "rgba(14,165,233,0.8)" },
  delivered: { dot: "#003F62", label: "Delivered", badge: "rgba(0,63,98,0.7)" },
  cancelled: { dot: "#EF4444", label: "Cancelled", badge: "rgba(239,68,68,0.7)" },
};

const ALL_STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusOpen, setStatusOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token || !id) return;
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, id]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function fetchOrder() {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      setOrder(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!order) return;
    setStatusOpen(false);
    setUpdating(true);
    try {
      const res = await fetch(`http://localhost:3001/api/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setOrder((prev) => (prev ? { ...prev, status: updated.status } : prev));
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return <div className="py-20 text-center text-black/40">Loading order…</div>;
  }

  if (!order) {
    return <div className="py-20 text-center text-black/40">Order not found.</div>;
  }

  const sc = STATUS_CONFIG[order.status] ?? {
    dot: "#9CA3AF",
    label: order.status,
    badge: "rgba(156,163,175,0.3)",
  };
  const customer = typeof order.userId === "object" && order.userId !== null
    ? (order.userId as OrderUser)
    : null;
  const shortId = order._id.slice(-6).toUpperCase();

  const subtotal = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = order.discount ?? 0;
  const total = order.totalMoney;

  function formatDate(iso: string): string {
    const d = new Date(iso);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const day = d.getDate();
    const suffix = day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";
    return `${months[d.getMonth()]} ${day}${suffix}, ${d.getFullYear()}`;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Sub header */}
      <div>
        <h1
          className="text-2xl font-semibold"
          style={{ fontFamily: "'Rubik'", color: "#000" }}
        >
          Orders Details
        </h1>
        <p
          className="text-base font-semibold mt-1"
          style={{ fontFamily: "'Open Sans'", color: "#000", opacity: 0.8 }}
        >
          Home &gt; Order List &gt; Order Details
        </p>
      </div>

      {/* Main info card */}
      <div
        className="flex flex-col gap-6 p-6 rounded-2xl"
        style={{ background: "#FFFFFF" }}
      >
        {/* Order ID + status + date + action toolbar */}
        <div className="flex flex-col gap-3">
          {/* Row 1: ID + badge */}
          <div className="flex items-center gap-4">
            <span
              className="text-xl font-semibold"
              style={{ fontFamily: "'Rubik'", color: "#232321" }}
            >
              Orders ID: #{shortId}
            </span>
            <span
              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{
                fontFamily: "'Open Sans'",
                background: sc.badge,
                color: "#232321",
              }}
            >
              {sc.label}
            </span>
          </div>

          {/* Row 2: date + action buttons */}
          <div className="flex items-center justify-between">
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
                {formatDate(order.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Change Status dropdown */}
              <div className="relative" ref={statusRef}>
                <button
                  onClick={() => setStatusOpen((v) => !v)}
                  disabled={updating}
                  className="flex items-center gap-4 px-4 py-3 rounded-lg disabled:opacity-50 transition-opacity"
                  style={{ background: "#F4F2F2" }}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ fontFamily: "'Open Sans'", color: "#232321" }}
                  >
                    Change Status
                  </span>
                  <svg
                    width="20" height="20" viewBox="0 0 20 20" fill="none"
                    className={`transition-transform duration-200 ${statusOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#232321" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {statusOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 z-20 rounded-lg shadow-lg overflow-hidden"
                    style={{
                      background: "#fff",
                      border: "1px solid rgba(35,35,33,0.15)",
                      minWidth: "180px",
                    }}
                  >
                    {ALL_STATUSES.map((s) => (
                      <button
                        key={s}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-black/5 transition-colors flex items-center gap-2"
                        style={{ fontFamily: "'Open Sans'" }}
                        onClick={() => handleStatusChange(s)}
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

              {/* Print button */}
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center p-3 rounded-lg transition-opacity hover:opacity-80"
                style={{ background: "#F4F2F2" }}
                title="Print"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"
                    stroke="#232321" strokeWidth="1.5" strokeLinejoin="round"
                  />
                  <rect x="6" y="13" width="12" height="8" rx="1" stroke="#232321" strokeWidth="1.5" />
                </svg>
              </button>

              {/* Save button */}
              <button
                className="flex items-center justify-center px-4 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ background: "#F4F2F2", fontFamily: "'Open Sans'", color: "#232321" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* 3 info cards */}
        <div className="flex gap-4">
          {/* Customer */}
          <div
            className="flex flex-col gap-4 flex-1 p-6 rounded-2xl"
            style={{ background: "#FFFFFF", border: "1px solid #E7E7E3" }}
          >
            <div className="flex gap-4 items-start">
              <div
                className="w-14 h-14 flex items-center justify-center rounded-lg shrink-0"
                style={{ background: "#232321" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="#FFFFFF" strokeWidth="1.5" />
                  <path d="M3 21c0-4.418 4.03-8 9-8s9 3.582 9 8" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <span
                  className="text-xl font-semibold"
                  style={{ fontFamily: "'Rubik'", color: "#232321" }}
                >
                  Customer
                </span>
                <div className="flex flex-col gap-1">
                  <span
                    className="text-base font-semibold"
                    style={{ fontFamily: "'Open Sans'", color: "#70706E" }}
                  >
                    Full Name: {customer?.name ?? "N/A"}
                  </span>
                  <span
                    className="text-base font-semibold"
                    style={{ fontFamily: "'Open Sans'", color: "#70706E" }}
                  >
                    Email: {customer?.email ?? "N/A"}
                  </span>
                  <span
                    className="text-base font-semibold"
                    style={{ fontFamily: "'Open Sans'", color: "#70706E" }}
                  >
                    Phone: N/A
                  </span>
                </div>
              </div>
            </div>
            <button
              className="w-full py-2 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90"
              style={{ background: "#003F62", fontFamily: "'Inter'" }}
            >
              View profile
            </button>
          </div>

          {/* Order Info */}
          <div
            className="flex flex-col gap-4 flex-1 p-6 rounded-2xl"
            style={{ background: "#FFFFFF", border: "1px solid #E7E7E3" }}
          >
            <div className="flex gap-4 items-start">
              <div
                className="w-14 h-14 flex items-center justify-center rounded-lg shrink-0"
                style={{ background: "#232321" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="#FFFFFF" strokeWidth="1.5" />
                  <path d="M7.5 9h6M7.5 12h9M7.5 15h4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <span
                  className="text-xl font-semibold"
                  style={{ fontFamily: "'Rubik'", color: "#232321" }}
                >
                  Order Info
                </span>
                <div className="flex flex-col gap-1">
                  <span
                    className="text-base font-semibold"
                    style={{ fontFamily: "'Open Sans'", color: "#70706E" }}
                  >
                    Shipping: Standard
                  </span>
                  <span
                    className="text-base font-semibold"
                    style={{ fontFamily: "'Open Sans'", color: "#70706E" }}
                  >
                    Payment Method: Card
                  </span>
                  <span
                    className="text-base font-semibold"
                    style={{ fontFamily: "'Open Sans'", color: "#70706E" }}
                  >
                    Status: {sc.label}
                  </span>
                </div>
              </div>
            </div>
            <button
              className="w-full py-2 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90"
              style={{ background: "#003F62", fontFamily: "'Inter'" }}
            >
              Download info
            </button>
          </div>

          {/* Deliver to */}
          <div
            className="flex flex-col gap-4 flex-1 p-6 rounded-2xl"
            style={{ background: "#FFFFFF", border: "1px solid #E7E7E3" }}
          >
            <div className="flex gap-4 items-start">
              <div
                className="w-14 h-14 flex items-center justify-center rounded-lg shrink-0"
                style={{ background: "#232321" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z" stroke="#FFFFFF" strokeWidth="1.5" />
                  <circle cx="12" cy="10" r="3" stroke="#FFFFFF" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <span
                  className="text-xl font-semibold"
                  style={{ fontFamily: "'Rubik'", color: "#232321" }}
                >
                  Deliver to
                </span>
                <div className="flex flex-col gap-1">
                  {order.shippingAddress?.fullName ? (
                    <>
                      <span className="text-base font-semibold" style={{ fontFamily: "'Open Sans'", color: "#232321" }}>
                        {order.shippingAddress.fullName}
                      </span>
                      {order.shippingAddress.phone && (
                        <span className="text-sm" style={{ color: "#70706E" }}>{order.shippingAddress.phone}</span>
                      )}
                      <span className="text-sm" style={{ color: "#70706E" }}>
                        {order.shippingAddress.addressLine1}
                        {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
                      </span>
                      <span className="text-sm" style={{ color: "#70706E" }}>
                        {[order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.postalCode]
                          .filter(Boolean).join(", ")}
                      </span>
                      {order.shippingAddress.country && (
                        <span className="text-sm" style={{ color: "#70706E" }}>{order.shippingAddress.country}</span>
                      )}
                    </>
                  ) : (
                    <span className="text-base font-semibold" style={{ fontFamily: "'Open Sans'", color: "#70706E" }}>
                      Address: Not provided
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              className="w-full py-2 text-sm font-medium text-white rounded-lg transition-opacity hover:opacity-90"
              style={{ background: "#003F62", fontFamily: "'Inter'" }}
            >
              View profile
            </button>
          </div>
        </div>

        {/* Payment Info + Note row */}
        <div className="flex gap-4">
          {/* Payment Info */}
          <div
            className="flex flex-col gap-4 p-4 rounded-2xl shrink-0"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E7E7E3",
              width: "348px",
            }}
          >
            <span
              className="text-xl font-semibold"
              style={{ fontFamily: "'Rubik'", color: "#232321" }}
            >
              Payment Info
            </span>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center px-2 py-0.5 rounded"
                  style={{ border: "0.3px solid #E7E7E3" }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#F79E1B" }}
                  >
                    MC
                  </span>
                </div>
                <span
                  className="text-base font-semibold"
                  style={{ fontFamily: "'Open Sans'", color: "#70706E" }}
                >
                  Card **** **** ****
                </span>
              </div>
              <span
                className="text-base font-semibold"
                style={{ fontFamily: "'Open Sans'", color: "#70706E" }}
              >
                Business name: {customer?.name ?? "N/A"}
              </span>
              <span
                className="text-base font-semibold"
                style={{ fontFamily: "'Open Sans'", color: "#70706E" }}
              >
                Phone: N/A
              </span>
            </div>
          </div>

          {/* Note */}
          <div className="flex flex-col gap-2 flex-1">
            <span
              className="text-xl font-semibold"
              style={{ fontFamily: "'Rubik'", color: "#232321" }}
            >
              Note
            </span>
            <div
              className="flex-1 p-4 rounded-2xl"
              style={{ background: "#FFFFFF", border: "1px solid #E7E7E3" }}
            >
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full h-full min-h-[80px] resize-none bg-transparent text-base text-black focus:outline-none"
                style={{ fontFamily: "'Open Sans'" }}
                placeholder="Type some notes"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products card */}
      <div
        className="flex flex-col gap-4 p-6 rounded-3xl"
        style={{ background: "#FFFFFF" }}
      >
        {/* Heading */}
        <div className="flex items-center justify-between">
          <span
            className="text-xl font-semibold"
            style={{ fontFamily: "'Rubik'", color: "#000" }}
          >
            Products
          </span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.5" fill="#000" />
            <circle cx="12" cy="12" r="1.5" fill="#000" />
            <circle cx="12" cy="19" r="1.5" fill="#000" />
          </svg>
        </div>

        <div style={{ borderBottom: "0.5px solid rgba(35,35,33,0.2)" }} />

        {/* Column headers */}
        <div
          className="flex items-end justify-between pb-2"
          style={{ borderBottom: "0.5px solid rgba(35,35,33,0.2)" }}
        >
          <div className="flex items-center gap-4" style={{ width: "300px" }}>
            <div className="w-5" />
            <div className="w-10" />
            <span
              className="font-semibold"
              style={{
                fontFamily: "'Rubik'",
                color: "rgba(35,35,33,0.8)",
                fontSize: "20px",
                lineHeight: "24px",
              }}
            >
              Product Name
            </span>
          </div>
          <div className="flex flex-1 justify-between items-end pr-4">
            <div className="text-center w-24">
              <span
                className="text-base font-semibold"
                style={{ fontFamily: "'Rubik'", color: "rgba(35,35,33,0.8)" }}
              >
                Order ID
              </span>
            </div>
            <div className="text-center w-24">
              <span
                className="text-base font-semibold"
                style={{ fontFamily: "'Rubik'", color: "rgba(35,35,33,0.8)" }}
              >
                Quantity
              </span>
            </div>
            <div className="text-right w-24">
              <span
                className="text-base font-semibold"
                style={{ fontFamily: "'Rubik'", color: "rgba(35,35,33,0.8)" }}
              >
                Total
              </span>
            </div>
          </div>
        </div>

        {/* Item rows */}
        {order.items.length === 0 ? (
          <div className="py-6 text-center text-black/40 text-sm">No items in this order.</div>
        ) : (
          order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1"
              style={{ borderBottom: "0.5px solid rgba(35,35,33,0.2)" }}
            >
              <div className="flex items-center gap-4" style={{ width: "300px" }}>
                <input type="checkbox" className="w-5 h-5 opacity-75 cursor-pointer shrink-0" />
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                    style={{ background: "rgba(0,0,0,0.1)" }}
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-lg shrink-0"
                    style={{ background: "rgba(0,0,0,0.2)" }}
                  />
                )}
                <span
                  className="font-semibold text-base truncate"
                  style={{ fontFamily: "'Open Sans'", color: "#000" }}
                >
                  {item.name}
                </span>
              </div>

              <div className="flex flex-1 justify-between items-center pr-4">
                <div className="text-center w-24">
                  <span
                    className="text-sm font-semibold"
                    style={{ fontFamily: "'Open Sans'", color: "#000" }}
                  >
                    #{shortId}
                  </span>
                </div>
                <div className="text-center w-24">
                  <span
                    className="text-base font-semibold"
                    style={{ fontFamily: "'Open Sans'", color: "#000" }}
                  >
                    {item.quantity}
                  </span>
                </div>
                <div className="text-right w-24">
                  <span
                    className="text-base font-semibold"
                    style={{ fontFamily: "'Open Sans'", color: "#000" }}
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Order summary */}
        <div className="flex flex-col items-end gap-4 pt-2 pr-4">
          {[
            { label: "Subtotal",      value: `$${subtotal.toFixed(2)}` },
            ...(discount > 0 ? [{ label: "Discount", value: `-$${discount.toFixed(2)}` }] : []),
            { label: "Shipping Rate", value: "$0" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between"
              style={{ width: "280px" }}
            >
              <span
                className="text-base font-semibold"
                style={{ fontFamily: "'Open Sans'", color: "#232321" }}
              >
                {label}
              </span>
              <span
                className="text-base font-semibold"
                style={{ fontFamily: "'Open Sans'", color: "#232321" }}
              >
                {value}
              </span>
            </div>
          ))}
          <div
            className="flex items-center justify-between"
            style={{ width: "280px" }}
          >
            <span
              className="font-semibold"
              style={{ fontFamily: "'Open Sans'", color: "#232321", fontSize: "24px" }}
            >
              Total
            </span>
            <span
              className="font-semibold"
              style={{ fontFamily: "'Open Sans'", color: "#232321", fontSize: "24px" }}
            >
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
