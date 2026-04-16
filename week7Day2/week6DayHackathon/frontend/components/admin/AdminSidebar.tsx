"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

function DashboardIcon({ active }: { active?: boolean }) {
  const c = active ? "#FFFFFF" : "#232321";
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1" stroke={c} strokeWidth="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1" stroke={c} strokeWidth="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1" stroke={c} strokeWidth="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke={c} strokeWidth="1.5" />
    </svg>
  );
}

function ProductsIcon({ active }: { active?: boolean }) {
  const c = active ? "#FFFFFF" : "#232321";
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="5.5" width="13" height="9" rx="1" stroke={c} strokeWidth="1.5" />
      <path d="M5 5.5V4C5 2.895 5.895 2 7 2H9C10.105 2 11 2.895 11 4V5.5" stroke={c} strokeWidth="1.5" />
      <path d="M1.5 9.5H14.5" stroke={c} strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

function OrderListIcon({ active }: { active?: boolean }) {
  const c = active ? "#FFFFFF" : "#232321";
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2.5" y="1.5" width="11" height="13" rx="1" stroke={c} strokeWidth="1.5" />
      <path d="M5 5.5H11M5 8H11M5 10.5H8.5" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDown({ size = 16, color = "#232321" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const navItems = [
  { label: "DASHBOARD", href: "/admin", icon: DashboardIcon },
  { label: "ALL PRODUCTS", href: "/admin/products", icon: ProductsIcon },
  { label: "ORDER LIST", href: "/admin/orders", icon: OrderListIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { user } = useAuth();

  return (
    <aside
      className="fixed top-0 left-0 h-full w-[260px] flex flex-col z-40"
      style={{ background: "#FAFAFA", borderRight: "1px solid rgba(35,35,33,0.2)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-7">
        <svg width="64" height="24" viewBox="0 0 64 24" fill="none">
          <text x="0" y="18" fontFamily="Rubik" fontWeight="700" fontSize="20" fill="#0D3F84">Arik</text>
          <path d="M46 6 L52 6 Q58 6 58 12 Q58 18 52 18 L46 18 Z" fill="#949599" opacity="0.5" />
          <path d="M50 8 L56 12 L50 16" fill="#0D3F84" />
        </svg>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-3 px-6 mt-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-[13px] font-medium tracking-[0.25px] transition-colors"
              style={{
                background: active ? "#003F62" : "transparent",
                color: active ? "#FFFFFF" : "#232321",
              }}
            >
              <Icon active={active} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Categories */}
      <div className="px-6 mt-8">
        <button
          onClick={() => setCategoriesOpen((v) => !v)}
          className="flex items-center justify-between w-full"
        >
          <span className="font-semibold text-[20px] leading-6" style={{ color: "#232321" }}>
            Categories
          </span>
          <span className={`transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`}>
            <ChevronDown size={24} />
          </span>
        </button>
        {categoriesOpen && (
          <div className="mt-3 flex flex-col gap-1 pl-2">
            {["Casual", "Formal", "Party", "Gym", "T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategoriesOpen(false);
                  router.push(`/admin/products?category=${encodeURIComponent(cat)}`);
                }}
                className="text-sm py-1.5 text-left text-black/60 hover:text-black transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User info at bottom */}
      {user && (
        <div className="mt-auto px-6 py-4 border-t border-black/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#003F62] text-white text-sm font-bold flex items-center justify-center">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-[#232321]">{user.name}</span>
              <span className="text-[11px] text-black/40 capitalize">{user.role}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
