import React, { useState } from "react";
import { api } from "@/lib/api";

interface AuctionCardProps {
  auctionId?: string;
  carName?: string;
  carImage?: string;
  currentBid?: string;
  totalBids?: number;
  rating?: number;
  review?: string;
  endTime?: string;
  countdown?: { days: number; hours: number; mins: number; secs: number };
  trending?: boolean;
}

/* ── Star Rating ─────────────────────────────────────────── */
const StarRating = ({ rating = 5 }: { rating?: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        viewBox="0 0 10 10"
        className="w-2.5 h-2.5"
        fill={i < rating ? "#F9C146" : "#E0E0E0"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M5 0.5l1.18 2.39 2.64.38-1.91 1.86.45 2.63L5 6.5 2.64 7.76l.45-2.63L1.18 3.27l2.64-.38L5 0.5z" />
      </svg>
    ))}
  </div>
);

/* ── Countdown Tile ──────────────────────────────────────── */
const TimeTile = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center border border-[#2E3D83] rounded-sm px-0.5 pb-0.5 min-w-6.5">
    <span className="font-['Lato'] font-bold text-[10px] leading-3 text-[#2E3D83]">
      {String(value).padStart(2, "0")}
    </span>
    <span className="font-['Lato'] font-medium text-[8px] leading-2.5 tracking-[0.04em] text-[#939393]">
      {label}
    </span>
  </div>
);

/* ── Main Component ──────────────────────────────────────── */
const AuctionCard: React.FC<AuctionCardProps> = ({
  auctionId,
  carName = "Kia Carnival",
  carImage = "/kia-carnival.jpg",
  currentBid = "$1,079.99",
  totalBids = 130,
  rating = 5,
  review = "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattis....",
  trending = false,
  endTime = "06:00pm 03 Jan 2023",
  countdown = { days: 31, hours: 20, mins: 40, secs: 25 },
}) => {
  const [inWishlist, setInWishlist] = useState(false);

  async function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!auctionId) return;
    try {
      if (inWishlist) {
        await api.users.removeFromWishlist(auctionId);
        setInWishlist(false);
      } else {
        await api.users.addToWishlist(auctionId);
        setInWishlist(true);
      }
    } catch { /* user not logged in */ }
  }
  return (
    <div className="relative w-full bg-white border border-[#EAECF3] rounded-[5px] flex flex-col sm:flex-row overflow-visible">
      {/* ── Trending badge — top left ── */}
      {trending && (
        <div
          className="absolute top-0.5 left-0.5 z-10 bg-[#EF233C] px-1.5 py-0.5"
          style={{ borderRadius: "4px 2px 2px 0px" }}
        >
          <span className="font-['Lato'] font-semibold text-[10px] leading-3 text-white">
            Trending
          </span>
        </div>
      )}
      {/* ── Favourite button — floats top right ── */}
      <button
        onClick={toggleWishlist}
        className="absolute z-10 w-9 h-9 bg-transparent rounded-full flex items-center justify-center shadow-[0px_0px_4px_rgba(0,0,0,0.25)]"
        style={{ right: "-5px", top: "-5px" }}
        aria-label="Add to favourites"
      >
        {inWishlist
          ? <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#F9C146"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          : <img src="/star.png" alt="star" className="w-5 h-5"/>
        }
      </button>

      {/* ── Car image ── */}
      <div
        className="w-full sm:w-[27%] min-h-35 sm:min-h-0 bg-cover bg-center rounded-t-[5px] sm:rounded-l-[5px] sm:rounded-tr-none shrink-0"
        style={{ backgroundImage: `url("${encodeURI(carImage)}")` }}
      />

      {/* ── Content ── */}
      <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-x-6 gap-y-3">

        {/* Col 1 — car info + review */}
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-['Lato'] font-bold text-[20px] leading-6 text-[#2E3D83] truncate">
            {carName}
          </span>

          {/* Yellow pill badge */}
          <div className="w-18.75 h-1 bg-[#F4C23D] rounded-sm" />

          <StarRating rating={rating} />

          <p className="font-['Lato'] font-normal text-[14px] leading-4.25 text-[#939393] line-clamp-4 mt-1">
            {review}
          </p>

          <button className="font-['Lato'] font-semibold text-[12px] leading-3.5 text-[#2E3D83] text-left mt-1 hover:underline w-fit">
            View Details
          </button>
        </div>

        {/* Col 2 — Current Bid */}
        <div className="flex flex-col gap-0.5 justify-start pt-1 min-w-20">
          <span className="font-['Lato'] font-bold text-[14px] leading-4.25 text-[#2E3D83]">
            {currentBid}
          </span>
          <span className="font-['Lato'] font-normal text-[12px] leading-3.5 text-[#939393]">
            Current Bid
          </span>

          {/* Countdown + Time Left */}
          <div className="mt-3 flex flex-col gap-1">
            <div className="flex items-start gap-1">
              <TimeTile value={countdown.days} label="Days" />
              <TimeTile value={countdown.hours} label="Hours" />
              <TimeTile value={countdown.mins} label="mins" />
              <TimeTile value={countdown.secs} label="secs" />
            </div>
            <span className="font-['Lato'] font-normal text-[10px] leading-3 text-[#939393]">
              Time Left
            </span>
          </div>

          {/* Submit A Bid */}
          <button className="mt-3 px-3 py-1.5 border border-[#2E3D83] rounded-[5px] font-['Lato'] font-bold text-[16px] leading-4.75 text-[#2E3D83] hover:bg-[#2E3D83] hover:text-white transition-colors whitespace-nowrap">
            Submit A Bid
          </button>
        </div>

        {/* Col 3 — Total Bids */}
        <div className="flex flex-col gap-0.5 justify-start pt-1 min-w-17.5">
          <span className="font-['Lato'] font-bold text-[14px] leading-4.25 text-[#2E3D83]">
            {totalBids}
          </span>
          <span className="font-['Lato'] font-normal text-[12px] leading-3.5 text-[#939393]">
            Total Bids
          </span>
        </div>

        {/* Col 4 — End Time */}
        <div className="flex flex-col gap-0.5 justify-start pt-1 min-w-27.5">
          <span className="font-['Lato'] font-bold text-[14px] leading-4.25 text-[#2E3D83]">
            {endTime}
          </span>
          <span className="font-['Lato'] font-normal text-[12px] leading-3.5 text-[#939393]">
            End Time
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
