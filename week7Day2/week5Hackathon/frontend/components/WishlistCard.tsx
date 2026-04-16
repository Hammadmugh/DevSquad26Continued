'use client';
import { api } from "@/lib/api";

/* ── Countdown Tile ─────────────────────────────────────────── */
const TimeTile = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center border border-[#2E3D83] rounded-sm px-1 pt-0.5">
    <span className="font-['Lato'] font-bold text-[9px] leading-3 text-[#2E3D83]">{value}</span>
    <span className="font-['Lato'] font-medium text-[7px] tracking-[0.04em] text-[#939393]">{label}</span>
  </div>
);

/* ── Star Rating ────────────────────────────────────────────── */
const StarRating = () => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="#F9C146" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 0.5l1.18 2.39 2.64.38-1.91 1.86.45 2.63L5 6.5 2.64 7.76l.45-2.63L1.18 3.27l2.64-.38L5 0.5z" />
      </svg>
    ))}
  </div>
);

export interface WishlistCardProps {
  auctionId: string;
  name: string;
  image: string;
  currentBid: string;
  bids: string;
  endTime: string;
  trending?: boolean;
  onRemove?: () => void;
}

export default function WishlistCard({
  auctionId, name, image, currentBid, bids, endTime, trending = false, onRemove,
}: WishlistCardProps) {
  async function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.users.removeFromWishlist(auctionId);
      onRemove?.();
    } catch { /* ignore */ }
  }
  return (
    <div className="relative w-full border border-[#EAECF3] rounded-[5px] bg-white overflow-visible flex flex-col">
      {/* Trending badge */}
      {trending && (
        <div className="absolute top-2 left-2 z-10 bg-[#EF233C] px-1.5 py-0.5 rounded-[4px_2px_2px_0px]">
          <span className="font-['Lato'] font-semibold text-[10px] text-white">Trending</span>
        </div>
      )}

      {/* Star / wishlist FAB — click to remove */}
      <button
        onClick={handleRemove}
        className="absolute top-0 right-0 w-8 h-8 -translate-y-1/4 translate-x-1/4 bg-[#EAECF3] rounded-full flex items-center justify-center z-10 hover:bg-red-100 transition-colors"
        aria-label="Remove from wishlist"
        title="Remove from wishlist"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#F4C23D" stroke="#F4C23D" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Car name */}
      <div className="pt-3 pb-1 px-4 text-center">
        <span className="font-['Lato'] font-bold text-[16px] text-[#2E3D83]">{name}</span>
      </div>

      {/* Car image */}
      <div
        className="w-full h-36 bg-cover bg-center shrink-0"
        style={{ backgroundImage: `url("${encodeURI(image)}")` }}
      />

      {/* Stars + description */}
      <div className="px-4 mt-3 flex flex-col gap-1">
        <StarRating />
        <p className="font-['Lato'] font-normal text-[10px] leading-3 text-[#939393] line-clamp-2">
          Lorem ipsum dolor sit amet consectetur. Ipsum sit quam dui cursus porttitor...{" "}
          <span className="font-semibold text-[#2E3D83] cursor-pointer">View Details</span>
        </p>
      </div>

      {/* Current Bid + Total Bids */}
      <div className="px-4 mt-3 flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="font-['Lato'] font-bold text-[12px] text-[#2E3D83]">{currentBid}</span>
          <span className="font-['Lato'] font-normal text-[10px] text-[#939393]">Current Bid</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="font-['Lato'] font-bold text-[12px] text-[#2E3D83]">{bids}</span>
          <span className="font-['Lato'] font-normal text-[10px] text-[#939393] text-right">Total Bids</span>
        </div>
      </div>

      {/* Countdown + End Time */}
      <div className="px-4 mt-2 flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-1">
            <TimeTile value="31" label="Days" />
            <TimeTile value="20" label="Hours" />
            <TimeTile value="40" label="mins" />
            <TimeTile value="25" label="secs" />
          </div>
          <span className="font-['Lato'] font-normal text-[10px] text-[#939393]">Time Left</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="font-['Lato'] font-bold text-[12px] text-[#2E3D83] text-right">{endTime}</span>
          <span className="font-['Lato'] font-normal text-[10px] text-[#939393] text-right">End Time</span>
        </div>
      </div>

      {/* Submit A Bid */}
      <div className="px-4 py-4 mt-auto">
        <button className="w-full h-10 border border-[#2E3D83] rounded-[5px] font-['Lato'] font-bold text-[16px] text-[#2E3D83] hover:bg-[#2E3D83] hover:text-white transition-colors">
          Submit A Bid
        </button>
      </div>
    </div>
  );
}
