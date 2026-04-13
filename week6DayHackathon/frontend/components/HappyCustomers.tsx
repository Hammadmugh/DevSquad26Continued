"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import ReviewCard from "./ReviewCard";

const reviews = [
  {
    id: 1,
    name: "Sarah M.",
    rating: 5,
    review:
      '"I\'m blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I\'ve bought has exceeded my expectations."',
  },
  {
    id: 2,
    name: "Alex K.",
    rating: 5,
    review:
      '"Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions."',
  },
  {
    id: 3,
    name: "James L.",
    rating: 5,
    review:
      '"As someone who\'s always on the lookout for unique fashion pieces, I\'m thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends."',
  },
  {
    id: 4,
    name: "Mooen K.",
    rating: 5,
    review:
      '"The shopping experience at Shop.co has been nothing short of amazing. The unique collection of clothes and the ease of shopping makes it my go-to destination."',
  },
  {
    id: 5,
    name: "Mooen K.",
    rating: 5,
    review:
      '"The shopping experience at Shop.co has been nothing short of amazing. The unique collection of clothes and the ease of shopping makes it my go-to destination."',
  },
  {
    id: 6,
    name: "Sarah M.",
    rating: 5,
    review:
      '"I\'m blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I\'ve bought has exceeded my expectations."',
  },
  {
    id: 7,
    name: "Alex K.",
    rating: 5,
    review:
      '"Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions."',
  },
  {
    id: 8,
    name: "James L.",
    rating: 5,
    review:
      '"As someone who\'s always on the lookout for unique fashion pieces, I\'m thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends."',
  },
  {
    id: 9,
    name: "Mooen K.",
    rating: 5,
    review:
      '"The shopping experience at Shop.co has been nothing short of amazing. The unique collection of clothes and the ease of shopping makes it my go-to destination."',
  },
  {
    id: 10,
    name: "Mooen K.",
    rating: 5,
    review:
      '"The shopping experience at Shop.co has been nothing short of amazing. The unique collection of clothes and the ease of shopping makes it my go-to destination."',
  },
];

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className="w-9 h-9 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors"
    >
      {direction === "prev" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

export default function HappyCustomers() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="w-full bg-white py-12 md:py-16 px-4 md:px-[100px] overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between mb-8 md:mb-10">
        <h2
          className="text-black font-extrabold text-[32px] md:text-[48px] leading-tight uppercase max-w-[700px]"
          style={{ fontFamily: "'Integral CF', sans-serif" }}
        >
          Our Happy Customers
        </h2>
        <div className="flex items-center gap-2 shrink-0">
          <ArrowButton direction="prev" onClick={() => swiperRef.current?.slidePrev()} />
          <ArrowButton direction="next" onClick={() => swiperRef.current?.slideNext()} />
        </div>
      </div>

      {/* Swiper */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3 },
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="!overflow-visible"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id}>
            <ReviewCard {...review} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
