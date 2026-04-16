'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { io } from "socket.io-client";
import { api } from "@/lib/api";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Car Auction", href: "/car-auction" },
  { label: "Sell Your Car", href: "/sell-your-car" },
  { label: "About us", href: "/about-us" },
  { label: "Contact", href: "/contact" },
];

const StarIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#2E3D83" strokeWidth="1.8">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const CarIcon = () => <img src="/car-icon.png" alt="car icon" className="w-5 h-5" />;

const ChevronDown = () => (
  <svg viewBox="0 0 10 6" className="w-2.5 h-1.5 shrink-0" fill="#2E3D83">
    <path d="M1 1L5 5L9 1" stroke="#2E3D83" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#2E3D83" strokeWidth="2">
    <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#2E3D83" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
  </svg>
);

interface Notification {
  id: string;
  type: 'started' | 'bid' | 'outbid' | 'winner' | 'ended' | 'payment';
  message: string;
  time: string;
  read: boolean;
}

const NOTIF_ICON: Record<Notification['type'], string> = {
  started: '\uD83D\uDD14',
  bid:     '\uD83D\uDCB0',
  outbid:  '\u26A1',
  winner:  '\uD83C\uDFC6',
  ended:   '\uD83C\uDFC1',
  payment: '\uD83D\uDE9A',
};

function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ── Close on outside click ─────────────────────────── */
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  /* ── Load persisted notifications from DB on mount ──── */
  useEffect(() => {
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (!userId) return;
    api.notifications.getAll()
      .then((data) => {
        const mapped: Notification[] = data.map((n) => ({
          id: String(n._id ?? n.id ?? Date.now()),
          type: (n.type as Notification['type']) ?? 'ended',
          message: String(n.message ?? ''),
          time: n.createdAt
            ? new Date(String(n.createdAt)).toLocaleTimeString()
            : new Date().toLocaleTimeString(),
          read: Boolean(n.read),
        }));
        setNotifications(mapped);
      })
      .catch(() => {/* not logged in — silent */});
  }, []);

  /* ── Socket.io: live events ─────────────────────────── */
  useEffect(() => {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000';
    const socket = io(SOCKET_URL, { transports: ['websocket'] });

    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (userId) socket.emit('join:user', userId);

    socket.on('auction:started', ({ carName }: { carName: string }) => {
      setNotifications((prev) => [{
        id: Date.now().toString(), type: 'started',
        message: `New auction started: "${carName}"`,
        time: new Date().toLocaleTimeString(), read: false,
      }, ...prev]);
    });

    socket.on('bid:new:broadcast', ({ currentBid, userId: bidUserId }: { currentBid: number; userId: string }) => {
      const me = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      if (bidUserId === me) return;
      setNotifications((prev) => [{
        id: Date.now().toString(), type: 'bid',
        message: `New bid placed: $${currentBid.toLocaleString()}`,
        time: new Date().toLocaleTimeString(), read: false,
      }, ...prev]);
    });

    socket.on('bid:outbid', ({ carName, newAmount }: { carName: string; newAmount: number }) => {
      setNotifications((prev) => [{
        id: Date.now().toString(), type: 'outbid',
        message: `You were outbid on "${carName}". New top bid: $${newAmount.toLocaleString()}`,
        time: new Date().toLocaleTimeString(), read: false,
      }, ...prev]);
    });

    socket.on('bid:winner', ({ carName, amount }: { carName: string; amount: number }) => {
      setNotifications((prev) => [{
        id: Date.now().toString(), type: 'winner',
        message: `You won "${carName}" with a bid of $${amount.toLocaleString()}!`,
        time: new Date().toLocaleTimeString(), read: false,
      }, ...prev]);
    });

    socket.on('auction:winner:broadcast', ({ carName, winnerName, amount }: { carName: string; winnerName: string; amount: number }) => {
      setNotifications((prev) => [{
        id: Date.now().toString(), type: 'winner',
        message: `${winnerName} won "${carName}" for $${amount.toLocaleString()}`,
        time: new Date().toLocaleTimeString(), read: false,
      }, ...prev]);
    });

    socket.on('auction:ended:broadcast', ({ carName }: { carName: string }) => {
      setNotifications((prev) => [{
        id: Date.now().toString(), type: 'ended',
        message: `Auction ended: "${carName}"`,
        time: new Date().toLocaleTimeString(), read: false,
      }, ...prev]);
    });

    socket.on('payment:status', ({ status }: { status: string }) => {
      const messages: Record<string, string> = {
        ready_for_shipping: 'Your car is being prepared for shipping.',
        in_transit: 'Your car is now in transit!',
        delivered: 'Your car has been delivered.',
        completed: 'Auction completed. Enjoy your new car!',
      };
      const message = messages[status];
      if (message) {
        setNotifications((prev) => [{
          id: Date.now().toString(), type: 'payment',
          message, time: new Date().toLocaleTimeString(), read: false,
        }, ...prev]);
      }
    });

    return () => { socket.disconnect(); };
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    api.notifications.markAllRead().catch(() => {});
  }

  function clearAll() {
    setNotifications([]);
    setOpen(false);
    api.notifications.clearAll().catch(() => {});
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        aria-label="Notifications"
        onClick={() => { setOpen((o) => !o); if (!open) markAllRead(); }}
        className="relative"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#2E3D83" strokeWidth="1.5">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 bg-[#EF233C] rounded-full flex items-center justify-center px-0.5">
            <span className="font-['Lato'] font-bold text-[9px] text-white leading-none">
              {unread > 9 ? '9+' : unread}
            </span>
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-9 w-80 bg-white border border-[#EAECF3] rounded-[5px] shadow-lg z-50 overflow-hidden">
          <div className="bg-[#2E3D83] px-4 py-2.5 flex items-center justify-between">
            <span className="font-['Lato'] font-semibold text-[14px] text-white">
              Notifications {notifications.length > 0 && `(${notifications.length})`}
            </span>
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="font-['Lato'] text-[11px] text-[#F9C146] hover:text-yellow-300 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-[#F1F2FF]">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <span className="font-['Lato'] text-[13px] text-[#939393]">No notifications yet</span>
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`px-4 py-3 flex items-start gap-2 hover:bg-[#F8F9FF] transition-colors ${!n.read ? 'bg-[#F1F2FF]' : ''}`}>
                  <span className="text-base mt-0.5 shrink-0">{NOTIF_ICON[n.type]}</span>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-['Lato'] text-[13px] text-[#2E3D83] leading-5 wrap-break-word">{n.message}</span>
                    <span className="font-['Lato'] text-[11px] text-[#939393]">{n.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LightNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="w-full bg-[#E8EDFA]" style={{ minHeight: "82px" }}>
      <div className="max-w-360 mx-auto px-[8%] h-20.5 flex items-center justify-between">
        <Link href="/" className="shrink-0">
          <Image src="/car-deposite.png" alt="Car Deposit" width={165} height={42} priority />
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label} className="relative flex flex-col items-center">
              <Link
                href={link.href}
                className={`font-['Lato'] text-[16px] leading-4.75 whitespace-nowrap transition-colors ${
                  pathname === link.href ? "font-bold text-[#2E3D83]" : "font-normal text-[#545677] hover:text-[#2E3D83]"
                }`}
              >
                {link.label}
              </Link>
              {pathname === link.href && <span className="absolute -bottom-2 w-4 h-0.75 bg-[#2E3D83] rounded-full" />}
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-5">
          <Link href="/sell-your-car" aria-label="Wishlist"><StarIcon /></Link>
          <NotificationBell />
          <button className="flex flex-row items-center gap-0.5" aria-label="Account">
            <CarIcon /><ChevronDown />
          </button>
        </div>

        <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-[#E8EDFA] border-t border-[#2E3D83]/20 px-[8%] py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`font-['Lato'] text-[16px] leading-4.75 ${
                pathname === link.href ? "font-bold text-[#2E3D83]" : "font-normal text-[#545677]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-5 pt-2 border-t border-[#2E3D83]/20">
            <Link href="/sell-your-car" aria-label="Wishlist"><StarIcon /></Link>
            <NotificationBell />
            <button className="flex items-center gap-0.5" aria-label="Account">
              <CarIcon /><ChevronDown />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
