"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products as staticProducts } from "@/lib/products";
import Image from "next/image";

// ─── Star Rating ────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[5px]">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.floor(rating);
        const partial = !filled && i < rating;
        const pct = partial ? Math.round((rating - Math.floor(rating)) * 100) : 0;
        return (
          <span key={i} className="relative inline-block w-[18px] h-[18px]">
            <svg viewBox="0 0 18 18" fill="none" className="w-full h-full">
              <path d="M9 1L11.09 6.26L17 7.27L13 11.14L14.18 17L9 14.27L3.82 17L5 11.14L1 7.27L6.91 6.26L9 1Z" fill="#e5e7eb" />
            </svg>
            <span className="absolute inset-0 overflow-hidden" style={{ width: filled ? "100%" : partial ? `${pct}%` : "0%" }}>
              <svg viewBox="0 0 18 18" fill="none" className="w-[18px] h-[18px]">
                <path d="M9 1L11.09 6.26L17 7.27L13 11.14L14.18 17L9 14.27L3.82 17L5 11.14L1 7.27L6.91 6.26L9 1Z" fill="#FFC633" />
              </svg>
            </span>
          </span>
        );
      })}
    </div>
  );
}

// ─── Chevron ─────────────────────────────────────────────────────────────────
function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────
const COLORS = [
  "#00C12B", "#F50606", "#F5DD06", "#F57906",
  "#06CAF5", "#063AF5", "#7D06F5", "#F506A4",
  "#FFFFFF", "#000000",
];

const SIZES = ["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "3X-Large", "4X-Large"];
const DRESS_STYLES = ["Casual", "Formal", "Party", "Gym"];
const CATEGORIES = ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"];

interface Filters {
  categories: string[];
  priceMin: number;
  priceMax: number;
  colors: string[];
  sizes: string[];
  styles: string[];
}

function FilterPanel({
  filters,
  onChange,
  onApply,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onApply: () => void;
}) {
  const toggle = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: "'Satoshi', sans-serif" }}>

      {/* Categories */}
      <div className="flex flex-col gap-5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange({ ...filters, categories: toggle(filters.categories, cat) })}
            className="flex items-center justify-between text-base text-black/60 hover:text-black transition-colors"
          >
            <span className={filters.categories.includes(cat) ? "font-bold text-black" : ""}>{cat}</span>
            <ChevronDown className="-rotate-90 opacity-60" />
          </button>
        ))}
      </div>

      <hr className="border-black/10" />

      {/* Price */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-black text-[20px]">Price</span>
          <ChevronDown className="rotate-180" />
        </div>
        {/* Range track */}
        <div className="relative h-[6px] bg-[#F0F0F0] rounded-full">
          <div
            className="absolute h-[6px] bg-black rounded-full"
            style={{
              left: `${((filters.priceMin - 50) / 450) * 100}%`,
              right: `${100 - ((filters.priceMax - 50) / 450) * 100}%`,
            }}
          />
          <input type="range" min={50} max={500} value={filters.priceMin}
            onChange={(e) => onChange({ ...filters, priceMin: Math.min(+e.target.value, filters.priceMax - 10) })}
            className="absolute w-full h-[6px] opacity-0 cursor-pointer" />
          <input type="range" min={50} max={500} value={filters.priceMax}
            onChange={(e) => onChange({ ...filters, priceMax: Math.max(+e.target.value, filters.priceMin + 10) })}
            className="absolute w-full h-[6px] opacity-0 cursor-pointer" />
          {/* Thumb left */}
          <div className="absolute w-5 h-5 bg-black rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
            style={{ left: `${((filters.priceMin - 50) / 450) * 100}%` }} />
          {/* Thumb right */}
          <div className="absolute w-5 h-5 bg-black rounded-full top-1/2 -translate-y-1/2 translate-x-1/2 pointer-events-none"
            style={{ right: `${100 - ((filters.priceMax - 50) / 450) * 100}%` }} />
        </div>
        <div className="flex justify-between text-sm text-black/80 font-medium">
          <span>${filters.priceMin}</span>
          <span>${filters.priceMax}</span>
        </div>
      </div>

      <hr className="border-black/10" />

      {/* Colors */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[20px] text-black">Colors</span>
          <ChevronDown className="rotate-180" />
        </div>
        <div className="flex flex-wrap gap-4">
          {COLORS.map((color) => {
            const selected = filters.colors.includes(color);
            return (
              <button
                key={color}
                onClick={() => onChange({ ...filters, colors: toggle(filters.colors, color) })}
                className="w-[37px] h-[37px] rounded-full border flex items-center justify-center transition-all"
                style={{ background: color, borderColor: "rgba(0,0,0,0.2)", outline: selected ? "2px solid #000" : "none", outlineOffset: "2px" }}
              >
                {selected && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8L6.5 11.5L13 5" stroke={color === "#FFFFFF" ? "#000" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-black/10" />

      {/* Size */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-black text-[20px]">Size</span>
          <ChevronDown className="rotate-180" />
        </div>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const selected = filters.sizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => onChange({ ...filters, sizes: toggle(filters.sizes, size) })}
                className={`px-5 py-[10px] rounded-full text-sm transition-colors ${selected ? "bg-black text-white font-medium" : "bg-[#F0F0F0] text-black/60"}`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-black/10" />

      {/* Dress Style */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-black text-[20px]">Dress Style</span>
          <ChevronDown className="rotate-180" />
        </div>
        <div className="flex flex-col gap-5">
          {DRESS_STYLES.map((s) => (
            <button
              key={s}
              onClick={() => onChange({ ...filters, styles: toggle(filters.styles, s) })}
              className="flex items-center justify-between text-base text-black/60 hover:text-black transition-colors"
            >
              <span className={filters.styles.includes(s) ? "font-bold text-black" : ""}>{s}</span>
              <ChevronDown className="-rotate-90 opacity-60" />
            </button>
          ))}
        </div>
      </div>

      <hr className="border-black/10" />

      {/* Apply */}
      <button
        onClick={onApply}
        className="w-full bg-black text-white font-medium text-sm rounded-full py-4 hover:opacity-80 transition-opacity"
      >
        Apply Filter
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 9;

type CatalogItem = {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  images: string[];
  colors: string[];
  sizes: string[];
  category: string;
};

export default function CategoryPage({ params }: { params: Promise<{ style: string }> }) {
  const { style } = use(params);
  const label = style.charAt(0).toUpperCase() + style.slice(1).replace(/-/g, " ");

  const [sortBy, setSortBy] = useState("Most Popular");
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);

  // Fetch products from both static + backend
  useEffect(() => {
    const staticItems: CatalogItem[] = staticProducts.map((p) => ({
      ...p,
      id: p.id,
      images: p.images,
    }));

    fetch("http://localhost:3001/api/products")
      .then((r) => r.json())
      .then((data: { _id: string; name: string; price: number; salePrice?: number | null; onSale?: boolean; rating: number; images: string[]; category?: string }[]) => {
        if (!Array.isArray(data)) { setCatalog(staticItems); return; }
        const backendItems: CatalogItem[] = data.map((p) => {
          const displayPrice = p.onSale && p.salePrice ? p.salePrice : p.price;
          const originalPrice = p.onSale && p.salePrice ? p.price : undefined;
          const discount = originalPrice ? Math.round((1 - displayPrice / originalPrice) * 100) : undefined;
          return {
            id: p._id,
            name: p.name,
            price: displayPrice,
            originalPrice,
            discount,
            rating: p.rating ?? 4,
            images: p.images?.length ? p.images : ["/new-arrival-1.png"],
            colors: [],
            sizes: ["Small", "Medium", "Large", "X-Large"],
            category: p.category ?? "Casual",
          };
        });
        setCatalog([...staticItems, ...backendItems]);
      })
      .catch(() => setCatalog(staticItems));
  }, []);

  const defaultFilters: Filters = {
    categories: [],
    priceMin: 50,
    priceMax: 500,
    colors: [],
    sizes: [],
    styles: [],
  };
  const [pendingFilters, setPendingFilters] = useState<Filters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(defaultFilters);

  // Apply filters to the combined catalog
  const filtered = catalog.filter((p) => {
    if (appliedFilters.categories.length > 0 && !appliedFilters.categories.includes(p.category)) return false;
    if (p.price < appliedFilters.priceMin || p.price > appliedFilters.priceMax) return false;
    if (appliedFilters.colors.length > 0 && !appliedFilters.colors.some((c) => p.colors.includes(c))) return false;
    if (appliedFilters.sizes.length > 0 && !appliedFilters.sizes.some((s) => p.sizes.includes(s))) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Newest") return Number(b.id) - Number(a.id);
    return b.rating - a.rating; // Most Popular
  });

  const totalItems = sorted.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  function applyFilters() {
    setAppliedFilters(pendingFilters);
    setMobileFilterOpen(false);
    setPage(1);
  }

  // Build visible page numbers: 1, 2, 3, ..., totalPages-1, totalPages (max 7 shown)
  function getPageNumbers() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, "...", totalPages - 1, totalPages];
    if (page >= totalPages - 2) return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  }

  return (
    <>
      <AnnouncementBanner />
      <Navbar />

      <main className="bg-white min-h-screen overflow-x-hidden" style={{ fontFamily: "'Satoshi', sans-serif" }}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-[100px]">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-3 py-5 text-base">
            <Link href="/" className="text-black/60 hover:text-black transition-colors">Home</Link>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-black font-medium">{label}</span>
          </nav>

          <hr className="border-black/10 mb-6" />

          <div className="flex gap-8">

            {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
            <aside className="hidden md:block w-[295px] shrink-0">
              <div className="border border-black/10 rounded-[20px] p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black text-[20px]">Filters</span>
                  <Image src={"/filter-btn.png"} alt="filter" width={24} height={24}/>
                </div>
                <hr className="border-black/10" />
                <FilterPanel filters={pendingFilters} onChange={setPendingFilters} onApply={applyFilters} />
              </div>
            </aside>

            {/* ── Main Content ─────────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">

              {/* Header row */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h1 className="font-bold text-[32px] leading-[43px] text-black" style={{ fontFamily: "'Integral CF', sans-serif" }}>
                    {label}
                  </h1>
                  <span className="text-black/60 text-base hidden md:block">
                    Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, totalItems)} of {totalItems} Products
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile: filter icon button */}
                  <button
                    className="md:hidden w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center"
                    onClick={() => setMobileFilterOpen(true)}
                    aria-label="Open filters"
                  >
                    <Image src={"/filter-btn.png"} alt="btn" width={25} height={25}/>
                  </button>
                </div>
              </div>

              {/* Mobile: showing count */}
              <p className="md:hidden text-black/60 text-sm mb-4">
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, totalItems)} of {totalItems} Products
              </p>

              {/* Product Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {paginated.map((p) => (
                  <ProductCard
                    key={`${p.id}-${p.name}`}
                    name={p.name}
                    price={p.price}
                    originalPrice={p.originalPrice}
                    discount={p.discount}
                    rating={p.rating}
                    image={p.images[0]}
                    href={`/products/${p.id}`}
                  />
                ))}
              </div>

              {/* Divider */}
              <hr className="border-black/10 my-8" />

              {/* Pagination */}
              <div className="flex items-center justify-between pb-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2 border border-black/20 text-black rounded-lg px-3 md:px-[14px] py-2 text-sm font-medium disabled:opacity-40 hover:bg-black hover:text-white transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Previous
                </button>

                {/* Desktop: full page numbers */}
                <div className="hidden md:flex items-center gap-[2px]">
                  {getPageNumbers().map((n, idx) =>
                    n === "..." ? (
                      <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-sm text-black/50">…</span>
                    ) : (
                      <button
                        key={n}
                        onClick={() => setPage(Number(n))}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          page === n ? "bg-black/[0.06] text-black font-bold" : "text-black/50 hover:bg-black/5"
                        }`}
                      >
                        {n}
                      </button>
                    )
                  )}
                </div>

                {/* Mobile: page X of Y */}
                <span className="md:hidden text-sm font-medium text-black/60">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 border border-black/20 text-black rounded-lg px-3 md:px-[14px] py-2 text-sm font-medium disabled:opacity-40 hover:bg-black hover:text-white transition-colors"
                >
                  Next
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Mobile Filter Drawer ─────────────────────────────────────────────── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilterOpen(false)} />

          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-6">
              {/* Drawer header */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-[20px] text-black" style={{ fontFamily: "'Satoshi', sans-serif" }}>Filters</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-black/40 hover:text-black transition-colors text-2xl leading-none"
                  aria-label="Close filters"
                >
                  ×
                </button>
              </div>
              <FilterPanel filters={pendingFilters} onChange={setPendingFilters} onApply={applyFilters} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
