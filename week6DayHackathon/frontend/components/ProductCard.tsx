import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  maxRating?: number;
  image: string;
  href?: string;
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i + 1 <= Math.floor(rating);
        const partial = !filled && i < rating;
        const fillPercent = partial ? Math.round((rating - Math.floor(rating)) * 100) : 0;

        return (
          <span key={i} className="relative inline-block w-[18px] h-[18px]">
            {/* Background star (empty) */}
            <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path
                d="M9 1L11.09 6.26L17 7.27L13 11.14L14.18 17L9 14.27L3.82 17L5 11.14L1 7.27L6.91 6.26L9 1Z"
                fill="#e5e7eb"
              />
            </svg>
            {/* Foreground star (filled / partial) */}
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: filled ? "100%" : partial ? `${fillPercent}%` : "0%" }}
            >
              <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]">
                <path
                  d="M9 1L11.09 6.26L17 7.27L13 11.14L14.18 17L9 14.27L3.82 17L5 11.14L1 7.27L6.91 6.26L9 1Z"
                  fill="#FFC633"
                />
              </svg>
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default function ProductCard({
  name,
  price,
  originalPrice,
  discount,
  rating,
  maxRating = 5,
  image,
  href = "/",
}: ProductCardProps) {
  return (
    <Link href={href} className="flex flex-col gap-3 group w-full max-w-[295px]">
      {/* Image container */}
      <div className="relative w-full aspect-square bg-[#F0EEED] rounded-[20px] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 px-1">
        <h3
          className="text-black font-bold text-[16px] md:text-[20px] leading-[22px] md:leading-[27px] line-clamp-1"
          style={{ fontFamily: "'Satoshi', sans-serif" }}
        >
          {name}
        </h3>

        <div className="flex items-center gap-3">
          <StarRating rating={rating} max={maxRating} />
          <span
            className="text-black text-sm leading-[19px]"
            style={{ fontFamily: "'Satoshi', sans-serif" }}
          >
            {rating}/{maxRating}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <p
            className="text-black font-bold text-[16px] md:text-[24px] leading-[22px] md:leading-[32px]"
            style={{ fontFamily: "'Satoshi', sans-serif" }}
          >
            ${price}
          </p>
          {originalPrice && (
            <p
              className="text-black/40 font-bold text-[16px] md:text-[24px] leading-[22px] md:leading-[32px] line-through"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              ${originalPrice}
            </p>
          )}
          {discount && (
            <span
              className="text-[#FF3333] bg-[#FF33331A] text-xs font-medium px-2 py-1 rounded-full"
              style={{ fontFamily: "'Satoshi', sans-serif" }}
            >
              -{discount}%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
