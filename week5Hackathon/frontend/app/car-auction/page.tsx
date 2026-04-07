'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Aboutus from "@/components/Aboutus";
import LightNavbar from "@/components/LightNavbar";
import AuctionFooter from "@/components/AuctionFooter";
import AuctionCard from "@/components/AuctionCard";
import FilterCard, { type FilterValues } from "@/components/FilterCard";
import { api } from "@/lib/api";

interface AuctionItem {
  _id: string;
  carName: string;
  carImage: string;
  currentBid: number;
  bids: { amount: number }[];
  rating: number;
  review: string;
  endTime: string;
  trending: boolean;
}

function getCountdown(endTime: string) {
  const diff = Math.max(0, new Date(endTime).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    secs: Math.floor((diff % (1000 * 60)) / 1000),
  };
}
/* ── Pagination ─────────────────────────────────────────────── */
const Pagination = ({ current, total, onPage }: { current: number; total: number; onPage: (p: number) => void }) => {
  if (total <= 1) return null;

  const delta = 3;
  const start = Math.max(1, current - delta);
  const end = Math.min(total, current + delta);
  const range: number[] = [];
  for (let i = start; i <= end; i++) range.push(i);

  return (
    <div className="flex items-center gap-1 mt-8">
      <button
        disabled={current === 1}
        onClick={() => onPage(current - 1)}
        className="w-7 h-7 flex items-center justify-center bg-[#F7F7FA] rounded-sm hover:bg-gray-200 transition-colors disabled:opacity-40"
      >
        <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none">
          <path d="M6.5 2L3.5 5l3 3" stroke="#1C1C28" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPage(1)} className="w-7 h-7 flex items-center justify-center rounded-sm bg-[#F7F7FA] font-['Lato'] font-medium text-xs hover:bg-gray-200">1</button>
          {start > 2 && <span className="text-[#2E3D83] text-xs px-0.5">…</span>}
        </>
      )}

      {range.map((page) => (
        <button
          key={page}
          onClick={() => onPage(page)}
          className={`w-7 h-7 flex items-center justify-center rounded-sm font-['Lato'] font-medium text-xs transition-colors ${
            page === current ? "bg-[#2E3D83] text-white" : "bg-[#F7F7FA] text-[#1C1C28] hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}

      {end < total && (
        <>
          {end < total - 1 && <span className="text-[#2E3D83] text-xs px-0.5">…</span>}
          <button onClick={() => onPage(total)} className="w-7 h-7 flex items-center justify-center rounded-sm bg-[#F7F7FA] font-['Lato'] font-medium text-xs hover:bg-gray-200">{total}</button>
        </>
      )}

      <button
        disabled={current === total}
        onClick={() => onPage(current + 1)}
        className="w-7 h-7 flex items-center justify-center bg-[#F7F7FA] rounded-sm hover:bg-gray-200 transition-colors disabled:opacity-40"
      >
        <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none">
          <path d="M3.5 2L6.5 5l-3 3" stroke="#1C1C28" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

/* ── Page Component ─────────────────────────────────────────── */
export default function CarAuctionPage() {
  const [cars, setCars] = useState<AuctionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  function fetchAuctions(params?: Record<string, string>, page = 1) {
    const merged = { ...params, page: String(page), limit: '10' };
    api.auctions.getAll(merged)
      .then((res) => {
        setCars(res.data as AuctionItem[]);
        setTotal(res.total);
        setTotalPages(res.totalPages ?? 1);
        setCurrentPage(page);
      })
      .catch(() => {});
  }

  useEffect(() => {
    fetchAuctions();
  }, []);

  function handleFilter(filters: FilterValues) {
    const params: Record<string, string> = {};
    if (filters.type) params.type = filters.type;
    if (filters.color) params.color = filters.color;
    if (filters.make) params.make = filters.make;
    if (filters.model) params.model = filters.model;
    if (filters.style) params.style = filters.style;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    setActiveFilters(params);
    fetchAuctions(params, 1);
  }

  function handlePage(page: number) {
    fetchAuctions(activeFilters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* ── Aboutus + Navbar ─────────────────────────────────────── */}
      <Aboutus />
      <LightNavbar />

      {/* ── Hero band ────────────────────────────────────────────── */}
      <div className="w-full bg-[#C6D8F9] pt-10 flex flex-col items-center gap-3">
        <h1 className="font-['Josefin_Sans'] font-semibold text-[48px] sm:text-[64px] leading-16 text-[#2E3D83] text-center">
          Auction
        </h1>
        {/* Blue underline bar */}
        <div className="w-20 h-0.75 bg-[#2E3D83] rounded-full" />

        {/* Subtitle */}
        <p className="font-['Lato'] font-medium text-[16px] sm:text-[18px] leading-5.5 text-[#545677] text-center max-w-xl px-4">
          Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.
        </p>

        {/* Breadcrumb pill */}
        <div className="mt-2 flex items-center gap-1 bg-[#BBD0F6] rounded-t-[3px] px-4 py-2">
          <span className="font-['Lato'] font-medium text-[14px] leading-4.25 text-[#545677]">
            Home
          </span>
          <svg viewBox="0 0 16 16" className="w-4 h-4 shrink-0" fill="none">
            <path
              d="M6 4l4 4-4 4"
              stroke="#000"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-['Lato'] font-medium text-[14px] leading-4.25 text-[#2E3D83]">
            Auction
          </span>
        </div>
      </div>

      {/* ── Main body ────────────────────────────────────────────── */}
      <div className="w-full max-w-7xl mx-auto px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* ── Left: listing column ─────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">

          {/* Results bar + sort dropdown */}
          <div className="flex items-center justify-between gap-4">
            {/* "Showing" pill */}
            <div className="bg-[#2E3D83] rounded-[5px] px-4 py-1.5">
              <span className="font-['Lato'] font-semibold text-[16px] leading-6 tracking-[0.2px] text-white whitespace-nowrap">
                Showing 1-{cars.length} of {total} Results
              </span>
            </div>

            {/* Right icons + sort */}
            <div className="flex items-center gap-3">
              {/* Settings icon */}
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="#2E3D83" strokeWidth="1.5">
                <path
                  d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Sort By Newness dropdown */}
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-200 rounded-[3px] px-3 py-1 pr-7 font-['Lato'] font-medium text-[12px] text-[#9A9A9A] cursor-pointer focus:outline-none">
                  <option>Sort By Newness</option>
                  <option>Sort By Price: Low to High</option>
                  <option>Sort By Price: High to Low</option>
                  <option>Sort By End Time</option>
                </select>
                <svg
                  viewBox="0 0 10 6"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-2.5 h-1.5 pointer-events-none"
                  fill="#2E3D83"
                >
                  <path d="M1 1L5 5L9 1" stroke="#2E3D83" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>
            </div>
          </div>

          {/* ── Auction cards ──────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {cars.map((car) => (
              <Link key={car._id} href={`/auction-detail/${car._id}`}>
                <AuctionCard
                  auctionId={car._id}
                  carName={car.carName}
                  carImage={car.carImage}
                  currentBid={`$${car.currentBid.toLocaleString()}`}
                  totalBids={car.bids?.length ?? 0}
                  rating={car.rating}
                  review={car.review}
                  endTime={new Date(car.endTime).toLocaleString()}
                  countdown={getCountdown(car.endTime)}
                  trending={car.trending}
                />
              </Link>
            ))}
          </div>

          {/* ── Pagination ─────────────────────────────────────── */}
          <Pagination current={currentPage} total={totalPages} onPage={handlePage} />
        </div>

        {/* ── Right: filter column ──────────────────────────────── */}
        <div className="lg:w-72 shrink-0">
          <FilterCard onFilter={handleFilter} />
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <AuctionFooter />
    </div>
  );
}
