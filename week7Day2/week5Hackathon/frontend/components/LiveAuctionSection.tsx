'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import LiveAuctionCard from "./LiveAuctionCard";
import { api } from "@/lib/api";

interface LiveAuction {
  _id: string;
  carName: string;
  carImage: string;
  currentBid: number;
  trending: boolean;
  endTime: string;
}

function timeLeft(endTime: string): string {
  const diff = Math.max(0, new Date(endTime).getTime() - Date.now());
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  return `${String(h).padStart(2, '0')} : ${String(m).padStart(2, '0')} : ${String(s).padStart(2, '0')}`;
}

const LiveAuctionSection: React.FC = () => {
  const [auctions, setAuctions] = useState<LiveAuction[]>([]);

  useEffect(() => {
    api.auctions.getLive()
      .then((data) => setAuctions(data as LiveAuction[]))
      .catch(() => {/* silently ignore on fetch failure */});
  }, []);
  return (
    <section className="w-full bg-[#2E3D83] my-15">
      {/* ── Header area ─────────────────────────────────────────── */}
      <div className="px-[8%] pt-10 md:pt-14">
        {/* Centered large heading */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="font-['Lato'] font-bold text-[28px] md:text-[36px] lg:text-[40px] leading-tight text-white">
            Live Auction
          </h2>

          {/* Decorative line + gold diamond */}
          <div className="flex items-center justify-center mt-4">
            <div className="h-px bg-white w-20 md:w-30" />
            <div
              className="w-3.5 h-3.5 bg-[#F9B610] mx-2 shrink-0"
              style={{ transform: "rotate(-43.35deg)" }}
            />
            <div className="h-px bg-white w-20 md:w-30" />
          </div>
        </div>

        {/* Tab pills */}
        <div className="flex items-end gap-6 md:gap-12">
          {/* Live Auction — active tab */}
          <div className="flex flex-col items-stretch gap-1">
            <button className="rounded-full px-4 md:px-6 py-2 font-['Lato'] font-medium text-base md:text-[20px] leading-6 text-white whitespace-nowrap">
              Live Auction
            </button>
            {/* Yellow underline accent matching Rectangle 17514 */}
            <div className="h-1.25 bg-[#FFC300] rounded-sm" />
          </div>
        </div>
      </div>

      {/* White divider matching Rectangle 17513 */}
      <div className="w-full h-px bg-white mt-3" />

      {/* ── Cards grid ──────────────────────────────────────────── */}
      <div className="px-[4%] sm:px-[8%] pt-10 pb-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-5 justify-items-center">
        {auctions.map((item) => (
          <Link key={item._id} href={`/auction-detail/${item._id}`} className="block">
            <LiveAuctionCard
              auctionId={item._id}
              carName={item.carName}
              carImage={item.carImage}
              currentBid={`$${item.currentBid.toLocaleString()}`}
              timeLeft={timeLeft(item.endTime)}
              trending={item.trending}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LiveAuctionSection;
