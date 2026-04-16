interface ReviewCardProps {
  name: string;
  rating: number;
  review: string;
  date?: string;
  showMenu?: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="23"
          height="23"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 1L11.09 6.26L17 7.27L13 11.14L14.18 17L9 14.27L3.82 17L5 11.14L1 7.27L6.91 6.26L9 1Z"
            fill={i < rating ? "#FFC633" : "#e5e7eb"}
          />
        </svg>
      ))}
    </div>
  );
}

function VerifiedIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="#01AB31" />
      <path
        d="M7 12.5L10.5 16L17 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ReviewCard({ name, rating, review, date, showMenu = false }: ReviewCardProps) {
  return (
    <div
      className="flex flex-col gap-[15px] p-7 md:p-8 border border-black/10 rounded-[20px] w-full"
      style={{ fontFamily: "'Satoshi', sans-serif" }}
    >
      {/* Stars + optional dots menu */}
      <div className="flex items-center justify-between">
        <StarRating rating={rating} />
        {showMenu && (
          <button className="text-black/40 hover:text-black transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
        )}
      </div>

      {/* Name + verified */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <span className="font-bold text-[20px] leading-[22px] text-black">
            {name}
          </span>
          <VerifiedIcon />
        </div>

        {/* Review text */}
        <p className="text-black/60 text-base leading-[22px]">{review}</p>

        {/* Optional date */}
        {date && (
          <p className="text-black/60 font-medium text-base leading-[22px]">
            Posted on {date}
          </p>
        )}
      </div>
    </div>
  );
}
