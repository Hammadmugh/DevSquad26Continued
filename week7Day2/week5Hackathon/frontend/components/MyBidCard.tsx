/* ── Countdown Tile ─────────────────────────────────────────── */
const TimeTile = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center border border-[#2E3D83] rounded-sm px-1 pt-0.5">
    <span className="font-['Lato'] font-bold text-[9px] leading-3 text-[#2E3D83]">{value}</span>
    <span className="font-['Lato'] font-medium text-[7px] tracking-[0.04em] text-[#939393]">{label}</span>
  </div>
);

export interface MyBidCardProps {
  name: string;
  image: string;
  winningBid: string;
  yourBid: string;
  bidStatus: "winning" | "losing";
  bids: string;
  trending?: boolean;
  canBid: boolean;
}

export default function MyBidCard({
  name, image, winningBid, yourBid, bidStatus, bids, trending = false, canBid,
}: MyBidCardProps) {
  const currentBidBg   = bidStatus === "winning" ? "bg-[#E8FFEC]" : "bg-[#FEE0E0]";
  const currentBidText = bidStatus === "winning" ? "text-[#01DB0A]" : "text-[#FF451D]";

  return (
    <div className="relative w-full border border-[#EAECF3] rounded-[5px] bg-white overflow-visible flex flex-col">
      {/* Trending badge */}
      {trending && (
        <div className="absolute top-2 left-2 z-10 bg-[#EF233C] px-1.5 py-0.5 rounded-[4px_2px_2px_0px]">
          <span className="font-['Lato'] font-semibold text-[10px] text-white">Trending</span>
        </div>
      )}

      {/* Star button */}
      <button
        className="absolute top-0 right-0 w-8 h-8 -translate-y-1/4 translate-x-1/4 bg-[#EAECF3] rounded-full flex items-center justify-center z-10"
        aria-label="Wishlist"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#2E3D83" strokeWidth="1.8">
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

      {/* Bid info: two boxes */}
      <div className="px-4 mt-3 flex gap-2">
        {/* Winning Bid */}
        <div className="flex-1 bg-[#F1F2FF] rounded-[5px] px-3 py-2 flex flex-col gap-0.5">
          <span className="font-['Lato'] font-bold text-[14px] text-[#2E3D83]">{winningBid}</span>
          <span className="font-['Lato'] font-normal text-[12px] text-[#939393]">Winning Bid</span>
        </div>
        {/* Your Current Bid */}
        <div className={`flex-1 ${currentBidBg} rounded-[5px] px-3 py-2 flex flex-col gap-0.5 items-end`}>
          <span className={`font-['Lato'] font-bold text-[14px] ${currentBidText}`}>{yourBid}</span>
          <span className="font-['Lato'] font-normal text-[12px] text-[#939393]">Your Current Bid</span>
        </div>
      </div>

      {/* Countdown + total bids */}
      <div className="px-4 mt-3 flex items-end justify-between">
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
          <span className="font-['Lato'] font-bold text-[12px] text-[#2E3D83]">{bids}</span>
          <span className="font-['Lato'] font-normal text-[10px] text-[#939393]">Total Bids</span>
        </div>
      </div>

      {/* Submit A Bid button */}
      <div className="px-4 py-4">
        {canBid ? (
          <button className="w-full h-10 bg-[#2E3D83] rounded-[5px] font-['Lato'] font-bold text-[16px] text-white hover:bg-[#243070] transition-colors">
            Submit A Bid
          </button>
        ) : (
          <div className="w-full h-10 bg-[#F1F2FF] rounded-[5px] flex items-center justify-center">
            <span className="font-['Lato'] font-bold text-[16px] text-[#939393]">Submit A Bid</span>
          </div>
        )}
      </div>
    </div>
  );
}
