import React, { useState } from "react";
import { api } from "@/lib/api";

interface LiveAuctionCardProps {
  auctionId?: string;
  carName?: string;
  carImage?: string;
  currentBid?: string;
  timeLeft?: string;
  trending?: boolean;
}

const LiveAuctionCard: React.FC<LiveAuctionCardProps> = ({
  auctionId,
  carName = "Alpine A110",
  carImage = "/favpng_alpine-a110-50-renault-sports-car.png",
  currentBid = "$1,079.99",
  timeLeft = "10 : 20 : 47",
  trending = false,
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
    <div className="relative w-68 h-87.5 bg-white border border-[#A9A9A9] rounded-[5px]">
      {/* Trending Badge — top-left corner */}
      {trending && (
        <div
          className="absolute z-20 flex items-center gap-1 px-1.5"
          style={{
            left: "0.42%",
            top: "0.29%",
            height: "16px",
            width: "27.61%",
            backgroundColor: "#EF233C",
            borderRadius: "4px 2px 2px 0px",
          }}
        >
          <svg
            viewBox="0 0 10 12"
            className="w-2.5 h-3 shrink-0"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 0C4 1.5 4.5 3 3 4C4 3.2 5.5 2.5 5.5 3.8C7 5 7.5 6.2 7 7.8C6.4 9.5 5 11 5 11C5 11 5.5 9 4.2 8C4.2 9.2 3.4 10.2 3 11C1.5 9.5 1 8 1.5 6.2C2 4.5 3 3.5 3 3.5C3 3.5 3.2 5 4 5C2.8 3.5 3 1 5 0Z" />
          </svg>
          <span className="font-['Lato'] font-semibold text-[10px] leading-3 text-white whitespace-nowrap">
            Trending
          </span>
        </div>
      )}

      {/* Favorite Star Button — top-right, slightly outside card */}
      <button
        onClick={toggleWishlist}
        className="absolute z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-[0px_0px_4px_rgba(0,0,0,0.25)]"
        style={{ right: "-5px", top: "-5px" }}
        aria-label="Add to favourites"
      >
        {inWishlist
          ? <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#F9C146"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          : <img src="/star.png" alt="star" className="w-5 h-5"/>
        }
      </button>

      {/* Car Name */}
      <p
        className="absolute left-0 right-0 font-['Lato'] font-bold text-[16px] leading-4.75 text-center text-black"
        style={{ top: "5.71%" }}
      >
        {carName}
      </p>

      {/* Divider Line */}
      <div
        className="absolute left-[0.42%] right-[0.42%]"
        style={{ top: "16.86%", height: "0.8px", backgroundColor: "#DEDEDE" }}
      />

      {/* Car Image (horizontally flipped per design) */}
      <div
        className="absolute left-[7.95%] right-[8.37%] top-[24.86%] bottom-[52.03%] bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${carImage})`,
          transform: "scaleX(-1)",
        }}
      />

      {/* Current Bid — left column */}
      <div
        className="absolute flex flex-col items-center gap-1.5"
        style={{ left: "8.37%", right: "60.67%", top: "62.57%" }}
      >
        <span className="font-['Lato'] font-bold text-[14px] leading-4.25 text-black text-center">
          {currentBid}
        </span>
        <span className="font-['Lato'] font-medium text-[14px] leading-4.25 text-black text-center">
          Current Bid
        </span>
      </div>

      {/* Timer — right column */}
      <div
        className="absolute flex flex-col items-center gap-1.5"
        style={{ left: "52.75%", right: "8.3%", top: "62.57%" }}
      >
        <span className="font-['Lato'] font-bold text-[14px] leading-4.25 text-black text-center">
          {timeLeft}
        </span>
        <span className="font-['Lato'] font-medium text-[14px] leading-4.25 text-black text-center">
          Waiting for Bid
        </span>
      </div>

      {/* Submit A Bid Button */}
      <button
        className="absolute left-[8.37%] right-[8.3%] flex items-center justify-center bg-[#2E3D83] rounded-[5px]"
        style={{ top: "82.86%", bottom: "5.71%" }}
      >
        <span className="font-['Lato'] font-bold text-[16px] leading-4.75 text-white">
          Submit A Bid
        </span>
      </button>
    </div>
  );
};

export default LiveAuctionCard;
