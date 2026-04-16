"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationsContext";

function CartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 6H21" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="7" r="4" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" stroke="rgba(0,0,0,0.4)" strokeWidth="1.8"/>
      <path d="M20 20L16.65 16.65" stroke="rgba(0,0,0,0.4)" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.73 21a2 2 0 01-3.46 0" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6L8 10L12 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12H21M3 6H21M3 18H21" stroke="black" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

const CATEGORY_ICON: Record<string, string> = {
  review: "⭐",
  purchase: "🛍️",
  sale: "🏷️",
  general: "🔔",
};

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { notifications, unreadCount, markAllRead, markRead, clearAll } = useNotifications();

  return (
    <div
      className="absolute top-full right-0 mt-2 w-[340px] bg-white border border-black/10 rounded-[16px] shadow-xl z-50 overflow-hidden"
      style={{ fontFamily: "'Satoshi', sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
        <span className="font-bold text-base text-black">
          Notifications {unreadCount > 0 && <span className="text-[#FF3333]">({unreadCount})</span>}
        </span>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-xs text-black/50 hover:text-black transition-colors">
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={clearAll} className="text-xs text-black/50 hover:text-black transition-colors">
              Clear all
            </button>
          )}
          <button onClick={onClose} className="text-black/40 hover:text-black transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[380px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center px-4">
            <BellIcon />
            <p className="text-sm text-black/40 mt-1">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#F8F8F8] transition-colors border-b border-black/5 last:border-0 ${!n.read ? "bg-[#F0F7FF]" : ""}`}
            >
              <span className="text-lg shrink-0 mt-0.5">{CATEGORY_ICON[n.category] ?? "🔔"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-black truncate">{n.title}</p>
                <p className="text-xs text-black/60 leading-snug mt-0.5 line-clamp-2">{n.body}</p>
                <p className="text-[10px] text-black/30 mt-1">
                  {n.timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {!n.read && <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0 mt-1.5" />}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

const navLinks = [
  { label: "Shop", href: "/shop", hasDropdown: true },
  { label: "On Sale", href: "/#on-sale" },
  { label: "New Arrivals", href: "/#new-arrivals" },
  { label: "Brands", href: "/#brands" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { totalCount } = useCart();
  const { user, openProfile, openAuthModal } = useAuth();
  const { unreadCount } = useNotifications();

  // Close notification panel when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  const SHOP_CATEGORIES = ["Casual", "Formal", "Party", "Gym"];

  return (
    <nav className="w-full bg-white border-b border-gray-100">
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-10 px-10 xl:px-[100px] h-[72px]">
        {/* Logo */}
        <Link
          href="/"
          className="text-black font-extrabold text-[28px] xl:text-[32px] leading-none tracking-tight shrink-0"
          style={{ fontFamily: "'Integral CF', sans-serif" }}
        >
          SHOP.CO
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6 shrink-0">
          {/* Shop with dropdown */}
          <div className="relative">
            <button
              onClick={() => setShopOpen((v) => !v)}
              onBlur={() => setTimeout(() => setShopOpen(false), 150)}
              className="flex items-center gap-1 text-black text-base hover:opacity-70 transition-opacity whitespace-nowrap"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Shop
              <span className={`transition-transform duration-200 ${shopOpen ? "rotate-180" : ""}`}>
                <ChevronDownIcon />
              </span>
            </button>
            {shopOpen && (
              <div className="absolute top-full left-0 mt-2 w-44 bg-white border border-black/10 rounded-[12px] shadow-lg py-2 z-50">
                {SHOP_CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    href={`/category/${cat.toLowerCase()}`}
                    onClick={() => setShopOpen(false)}
                    className="block px-4 py-2.5 text-sm text-black/70 hover:bg-[#F0F0F0] hover:text-black transition-colors"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Other nav links */}
          {navLinks.filter((l) => !l.hasDropdown).map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-1 text-black text-base leading-[22px] hover:opacity-70 transition-opacity whitespace-nowrap"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Search bar */}
        <div className="flex-1 flex items-center gap-3 bg-[#F0F0F0] rounded-[62px] px-4 py-3 min-w-0">
          <span className="shrink-0">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-base text-black placeholder:text-black/40 min-w-0"
            style={{ fontFamily: "'Satoshi', sans-serif" }}
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3.5 shrink-0">
          <Link href="/cart" className="relative hover:opacity-70 transition-opacity" aria-label="Cart">
            <CartIcon />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>

          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button
              aria-label="Notifications"
              onClick={() => setNotifOpen((v) => !v)}
              className="relative hover:opacity-70 transition-opacity"
            >
              <BellIcon />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3333] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
          </div>

          <button
            aria-label="Account"
            onClick={user ? openProfile : () => openAuthModal("login")}
            className="relative hover:opacity-70 transition-opacity"
          >
            {user?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <AccountIcon />
            )}
            {user && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center justify-between px-4 h-[64px]">
        <button
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="hover:opacity-70 transition-opacity"
        >
          <HamburgerIcon />
        </button>

        <Link
          href="/"
          className="text-black font-extrabold text-[24px] leading-none tracking-tight"
          style={{ fontFamily: "'Integral CF', sans-serif" }}
        >
          SHOP.CO
        </Link>

        <div className="flex items-center gap-3">
          <button aria-label="Search" className="hover:opacity-70 transition-opacity">
            <SearchIcon />
          </button>
          <Link href="/cart" className="relative hover:opacity-70 transition-opacity" aria-label="Cart">
            <CartIcon />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>
          {/* Mobile bell */}
          <div className="relative">
            <button
              aria-label="Notifications"
              onClick={() => setNotifOpen((v) => !v)}
              className="relative hover:opacity-70 transition-opacity"
            >
              <BellIcon />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3333] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </div>
          <button
            aria-label="Account"
            onClick={user ? openProfile : () => openAuthModal("login")}
            className="relative hover:opacity-70 transition-opacity"
          >
            {user?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <AccountIcon />
            )}
            {user && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col px-4 pb-4 gap-4 border-t border-gray-100">
          {/* Mobile search */}
          <div className="flex items-center gap-3 bg-[#F0F0F0] rounded-[62px] px-4 py-3 mt-3">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-base text-black placeholder:text-black/40"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            />
          </div>
          {/* Shop with sub-menu */}
          <div>
            <button
              onClick={() => setMobileShopOpen((v) => !v)}
              className="flex items-center justify-between w-full text-black text-base leading-[22px] py-1 border-b border-gray-100 hover:opacity-70 transition-opacity"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              Shop
              <span className={`transition-transform duration-200 ${mobileShopOpen ? "rotate-180" : ""}`}>
                <ChevronDownIcon />
              </span>
            </button>
            {mobileShopOpen && (
              <div className="flex flex-col pl-4 mt-1 gap-1">
                {SHOP_CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    href={`/category/${cat.toLowerCase()}`}
                    onClick={() => { setMobileShopOpen(false); setMobileMenuOpen(false); }}
                    className="text-black/70 text-sm py-2 hover:text-black transition-colors"
                    style={{ fontFamily: "'Satoshi', sans-serif" }}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Other nav links */}
          {navLinks.filter((l) => !l.hasDropdown).map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-black text-base leading-[22px] py-1 border-b border-gray-100 hover:opacity-70 transition-opacity"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
