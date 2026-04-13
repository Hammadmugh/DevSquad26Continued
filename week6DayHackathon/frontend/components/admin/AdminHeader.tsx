"use client";

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="9.5" cy="9.5" r="7" stroke="#232321" strokeWidth="1.8" />
      <path d="M20 20L14.65 14.65" stroke="#232321" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 2C11 2 6 4.5 6 11V15L4 17H18L16 15V11C16 4.5 11 2 11 2Z" stroke="#232321" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 17C9 18.105 9.895 19 11 19C12.105 19 13 18.105 13 17" stroke="#232321" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 6L8 10L12 6" stroke="#232321" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminHeader() {
  return (
    <header
      className="fixed top-0 left-[260px] right-0 h-[96px] flex items-center justify-end gap-10 px-[60px] z-30"
      style={{ background: "#FAFAFA", borderBottom: "1px solid rgba(35,35,33,0.2)" }}
    >
      <div className="flex items-center gap-10">
        <button className="hover:opacity-70 transition-opacity" aria-label="Search">
          <SearchIcon />
        </button>
        <button className="hover:opacity-70 transition-opacity" aria-label="Notifications">
          <BellIcon />
        </button>
        <button
          className="flex items-center gap-1 px-4 py-2 rounded-lg border text-[13px] font-medium tracking-[0.25px] uppercase hover:bg-gray-50 transition-colors"
          style={{ borderColor: "#1C1C1A", color: "#1C1C1A" }}
        >
          Admin
          <ChevronDown />
        </button>
      </div>
    </header>
  );
}
