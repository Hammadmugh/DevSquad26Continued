"use client";

import { useState, useEffect } from "react";
import AdminFooter from "@/components/admin/AdminFooter";
import { useAuth } from "@/context/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ───── Static sale graph data ───── */
const SALE_DATA = {
  weekly: [
    { label: "Mon", value: 80 },
    { label: "Tue", value: 120 },
    { label: "Wed", value: 95 },
    { label: "Thu", value: 200 },
    { label: "Fri", value: 160 },
    { label: "Sat", value: 310 },
    { label: "Sun", value: 280 },
  ],
  monthly: [
    { label: "JUL", value: 80 },
    { label: "AUG", value: 100 },
    { label: "SEP", value: 120 },
    { label: "OCT", value: 140 },
    { label: "NOV", value: 320 },
    { label: "DEC", value: 410 },
  ],
  yearly: [
    { label: "2019", value: 200 },
    { label: "2020", value: 280 },
    { label: "2021", value: 220 },
    { label: "2022", value: 350 },
    { label: "2023", value: 420 },
  ],
};

/* ───── Tiny icon helpers ───── */
function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 7H17L16 18H4L3 7Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7 7V5C7 3.343 8.343 2 10 2C11.657 2 13 3.343 13 5V7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 12V4M4 7L8 4L12 7" stroke="#232321" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="5"  r="1.5" fill="#000" />
      <circle cx="10" cy="10" r="1.5" fill="#000" />
      <circle cx="10" cy="15" r="1.5" fill="#000" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="14" rx="2" stroke="#232321" strokeWidth="1.5" />
      <path d="M6 2V5M14 2V5M2 8H18" stroke="#232321" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="6.5"  cy="12" r="1" fill="#232321" />
      <circle cx="10"   cy="12" r="1" fill="#232321" />
      <circle cx="13.5" cy="12" r="1" fill="#232321" />
      <circle cx="6.5"  cy="15" r="1" fill="#232321" />
      <circle cx="10"   cy="15" r="1" fill="#232321" />
    </svg>
  );
}

/* ───── Sub-components ───── */
function StatCard({ title, value, pct }: { title: string; value: string; pct: string }) {
  return (
    <div
      className="flex-1 flex flex-col gap-2 p-6 rounded-2xl min-w-0"
      style={{ background: "#FAFAFA" }}
    >
      {/* Title row */}
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-black" style={{ fontFamily: "'Rubik'" }}>
          {title}
        </span>
        <button className="hover:opacity-60 transition-opacity">
          <DotsIcon />
        </button>
      </div>

      {/* Value + pct */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#003F62" }}>
            <BagIcon />
          </div>
          <span className="text-[16px] font-semibold text-black" style={{ fontFamily: "'Rubik'" }}>
            {value}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ArrowUpIcon />
          <span className="text-[13px] font-semibold text-black" style={{ fontFamily: "'Open Sans'" }}>
            {pct}
          </span>
        </div>
      </div>

      {/* Compared */}
      <p
        className="text-right text-[11px] font-semibold opacity-70"
        style={{ fontFamily: "'Open Sans'", color: "#000" }}
      >
        Compared to Oct 2023
      </p>
    </div>
  );
}

type Period = "weekly" | "monthly" | "yearly";

function SaleGraph() {
  const [period, setPeriod] = useState<Period>("monthly");
  const data = SALE_DATA[period];

  return (
    <div
      className="flex flex-col gap-5 p-6 rounded-2xl"
      style={{ background: "#FAFAFA", flex: "1 1 0" }}
    >
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[20px] font-semibold text-black" style={{ fontFamily: "'Rubik'" }}>
            Sale Graph
          </span>
          <div className="flex items-center gap-3">
            {(["weekly", "monthly", "yearly"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="px-4 py-1.5 rounded-lg text-[13px] font-medium uppercase transition-colors tracking-[0.25px]"
                style={{
                  fontFamily: "'Inter'",
                  background: period === p ? "#003F62" : "transparent",
                  color: period === p ? "#FFFFFF" : "#232321",
                  border: period === p ? "none" : "1px solid #232321",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <hr style={{ borderColor: "#232321", opacity: 0.3 }} />
      </div>

      {/* Chart */}
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6E6E6" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontFamily: "Inter", fontSize: 12, fill: "#212121", fontWeight: 600 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontFamily: "Inter", fontSize: 12, fill: "#212121", fontWeight: 600 }}
              tickFormatter={(v) => `$${v}`}
              width={45}
            />
            <Tooltip
              contentStyle={{ fontFamily: "Inter", fontSize: 12, borderRadius: 8 }}
              formatter={(v) => [`$${v}`, "Sales"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#003F62"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "#003F62" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function BestSellers({ products }: { products: { name: string; price: string; sales: string; image?: string }[] }) {
  return (
    <div
      className="flex flex-col gap-4 p-6 pt-7 rounded-2xl w-[360px] shrink-0"
      style={{ background: "#FAFAFA" }}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="text-[20px] font-semibold text-black" style={{ fontFamily: "'Rubik'" }}>
            Best Sellers
          </span>
          <button className="hover:opacity-60 transition-opacity">
            <DotsIcon />
          </button>
        </div>
        <hr style={{ borderColor: "#232321", opacity: 0.3 }} />
      </div>

      <div className="flex flex-col gap-5 flex-1">
        {products.length === 0 && (
          <p className="text-sm text-black/40">No products yet.</p>
        )}
        {products.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-lg shrink-0 overflow-hidden"
                style={{ background: "rgba(0,0,0,0.18)" }}
              >
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[15px] font-semibold text-black" style={{ fontFamily: "'Open Sans'" }}>
                  {item.name}
                </span>
                <span className="text-[13px] font-semibold text-black/60" style={{ fontFamily: "'Open Sans'" }}>
                  {item.price}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[13px] font-semibold text-black/60" style={{ fontFamily: "'Open Sans'" }}>
                {item.sales}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        className="self-start px-4 py-2.5 rounded-lg text-[13px] font-medium uppercase tracking-[0.25px] text-white"
        style={{ background: "#003F62", fontFamily: "'Rubik'" }}
      >
        REPORT
      </button>
    </div>
  );
}

type RecentOrder = {
  product: string;
  orderId: string;
  date: string;
  customer: string;
  status: string;
  amount: string;
};

function RecentOrders({ orders }: { orders: RecentOrder[] }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [allSelected, setAllSelected] = useState(false);

  const toggleAll = () => {
    if (allSelected) {
      setSelected([]);
      setAllSelected(false);
    } else {
      setSelected(orders.map((_, i) => i));
      setAllSelected(true);
    }
  };

  const toggle = (i: number) => {
    setSelected((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const statusStyle = (status: string) => {
    if (status === "Delivered") return { dot: "#003F62", label: "#000" };
    if (status === "Canceled")  return { dot: "#FFA52F", label: "#000" };
    return { dot: "#999", label: "#000" };
  };

  const initials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div
      className="flex flex-col gap-4 p-6 rounded-2xl"
      style={{ background: "#F8F8F8" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[20px] font-semibold text-black" style={{ fontFamily: "'Rubik'" }}>
          Recent Orders
        </span>
        <button className="hover:opacity-60 transition-opacity">
          <DotsIcon />
        </button>
      </div>
      <hr style={{ borderColor: "rgba(35,35,33,0.2)" }} />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(35,35,33,0.2)" }}>
              <th className="pb-3 text-left w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded accent-[#232321] cursor-pointer"
                />
              </th>
              {["Product", "Order ID", "Date", "Customer Name", "Status", "Amount"].map((h) => (
                <th
                  key={h}
                  className="pb-3 text-center text-[15px] font-semibold"
                  style={{ fontFamily: "'Rubik'", color: "rgba(35,35,33,0.8)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-black/40">
                  No orders yet.
                </td>
              </tr>
            )}
            {orders.map((row, i) => {
              const st = statusStyle(row.status);
              return (
                <tr
                  key={i}
                  style={{ borderBottom: "0.5px solid rgba(35,35,33,0.2)" }}
                  className="hover:bg-black/5 transition-colors"
                >
                  {/* Checkbox */}
                  <td className="py-4 w-10">
                    <input
                      type="checkbox"
                      checked={selected.includes(i)}
                      onChange={() => toggle(i)}
                      className="w-4 h-4 rounded accent-[#232321] cursor-pointer"
                    />
                  </td>
                  {/* Product */}
                  <td className="py-4">
                    <span
                      className="text-[13px] font-semibold text-black"
                      style={{ fontFamily: "'Open Sans'" }}
                    >
                      {row.product}
                    </span>
                  </td>
                  {/* Order ID */}
                  <td className="py-4 text-center">
                    <span
                      className="text-[13px] font-semibold text-black"
                      style={{ fontFamily: "'Open Sans'" }}
                    >
                      {row.orderId}
                    </span>
                  </td>
                  {/* Date */}
                  <td className="py-4 text-center">
                    <span
                      className="text-[13px] font-semibold text-black"
                      style={{ fontFamily: "'Open Sans'" }}
                    >
                      {row.date}
                    </span>
                  </td>
                  {/* Customer */}
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                        style={{ background: "#003F62" }}
                      >
                        {initials(row.customer)}
                      </div>
                      <span
                        className="text-[13px] font-semibold text-black"
                        style={{ fontFamily: "'Open Sans'" }}
                      >
                        {row.customer}
                      </span>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: st.dot }}
                      />
                      <span
                        className="text-[13px] font-semibold"
                        style={{ fontFamily: "'Open Sans'", color: st.label }}
                      >
                        {row.status}
                      </span>
                    </div>
                  </td>
                  {/* Amount */}
                  <td className="py-4 text-center">
                    <span
                      className="text-[13px] font-semibold text-black"
                      style={{ fontFamily: "'Open Sans'" }}
                    >
                      {row.amount}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───── Main Dashboard Page ───── */
type StatCards = { title: string; value: string; pct: string }[];

export default function AdminDashboardPage() {
  const { token } = useAuth();

  const [statCards, setStatCards] = useState<StatCards>([
    { title: "Total Orders",     value: "—", pct: "—" },
    { title: "Active Orders",    value: "—", pct: "—" },
    { title: "Completed Orders", value: "—", pct: "—" },
    { title: "Return Orders",    value: "—", pct: "—" },
  ]);
  const [bestSellers, setBestSellers] = useState<{ name: string; price: string; sales: string; image?: string }[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    if (!token) return;

    // Fetch orders
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/orders/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((orders: { status: string; totalMoney: number; items: { name: string }[]; createdAt: string; _id: string; userId: { name?: string } | string }[]) => {
        if (!Array.isArray(orders)) return;

        const total = orders.length;
        const active = orders.filter((o) => o.status === "pending" || o.status === "paid" || o.status === "shipped").length;
        const completed = orders.filter((o) => o.status === "delivered").length;
        const cancelled = orders.filter((o) => o.status === "cancelled").length;

        setStatCards([
          { title: "Total Orders",     value: String(total),     pct: "" },
          { title: "Active Orders",    value: String(active),    pct: "" },
          { title: "Completed Orders", value: String(completed), pct: "" },
          { title: "Return Orders",    value: String(cancelled), pct: "" },
        ]);

        // Build recent orders rows (last 6)
        const rows: RecentOrder[] = orders
          .slice(-6)
          .reverse()
          .map((o) => ({
            product: o.items?.[0]?.name ?? "—",
            orderId: "#" + o._id.slice(-6).toUpperCase(),
            date: new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            customer: typeof o.userId === "object" ? (o.userId?.name ?? "—") : "—",
            status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
            amount: "$" + (o.totalMoney ?? 0).toFixed(2),
          }));
        setRecentOrders(rows);
      })
      .catch(() => {});

    // Fetch products for best sellers
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/api/products`)
      .then((r) => r.json())
      .then((products: { name: string; price: number; reviewCount?: number; images?: string[] }[]) => {
        if (!Array.isArray(products)) return;
        const top = [...products]
          .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
          .slice(0, 3)
          .map((p) => ({
            name: p.name,
            price: "$" + p.price.toFixed(2),
            sales: (p.reviewCount ?? 0) + " sales",
            image: p.images?.[0],
          }));
        setBestSellers(top);
      })
      .catch(() => {});
  }, [token]);
  return (
    <div className="flex flex-col gap-6 pt-6 pb-10">
      {/* Page header */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1
            className="text-[24px] font-semibold text-black leading-7"
            style={{ fontFamily: "'Rubik'" }}
          >
            Dashboard
          </h1>
          <p
            className="text-[15px] font-semibold text-black/80"
            style={{ fontFamily: "'Open Sans'" }}
          >
            Home &gt; Dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon />
          <span
            className="text-[15px] font-semibold text-black"
            style={{ fontFamily: "'Open Sans'" }}
          >
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="flex gap-3.5">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Chart + Best Sellers */}
      <div className="flex gap-3.5">
        <SaleGraph />
        <BestSellers products={bestSellers} />
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={recentOrders} />

      {/* Footer */}
      <AdminFooter />
    </div>
  );
}
