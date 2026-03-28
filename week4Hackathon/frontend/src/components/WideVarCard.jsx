import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import CategoryCard from "./CategoryCard";
import { categories } from "../../data";
import "swiper/css";
import "swiper/css/navigation";

const WideVarCard = ({ 
  title = "Explore Our Categories", 
  description = "Discover amazing content across different categories" 
}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (swiper) => {
    setCurrentSlide(swiper.realIndex % categories.length);
  };

  return (
    <div className="lg:max-w-[1597px] md:max-w-[1279px] max-w-[358px] w-full mx-auto px-4 sm:px-6 lg:px-17 flex flex-col gap-12 sm:gap-16 lg:gap-[60px] py-12 sm:py-16 lg:py-20">

      {/* Header */}
      <div className="flex justify-between items-end gap-10 flex-wrap md:flex-nowrap">
        
        <div className="flex flex-col gap-3 max-w-[1240px]">
          {title && (
            <h2 className="text-white text-[38px] font-bold">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-[#999999] text-[18px]">
              {description}
            </p>
          )}
        </div>

        {/* Controls - Desktop Only */}
        <div className="hidden md:flex items-center gap-4 p-4 bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl">
          
          <button 
            ref={prevRef}
            className="w-14 h-14 flex items-center justify-center bg-[#1A1A1A] border border-[#1F1F1F] rounded-lg hover:bg-[#262626] transition text-white text-xl font-bold"
          >
            <img src="/left arrow.png" alt="left" className="w-6 h-6" />
          </button>

          <div className="flex gap-1">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all ${
                  idx === currentSlide % 4
                    ? "w-6 bg-red-600"
                    : "w-4 bg-[#333]"
                }`}
              ></div>
            ))}
          </div>

          <button 
            ref={nextRef}
            className="w-14 h-14 flex items-center justify-center bg-[#1A1A1A] border border-[#1F1F1F] rounded-lg hover:bg-[#262626] transition text-white text-xl font-bold"
          >
            <img src="/right arrow.png" alt="left" className="w-6 h-6"/>
          </button>

        </div>
      </div>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Navigation]}
        loop={true}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        onSlideChange={handleSlideChange}
        spaceBetween={24}
        breakpoints={{
          320: {
            slidesPerView: 1.2,
          },
          640: {
            slidesPerView: 2.2,
          },
          1024: {
            slidesPerView: 3,
          },
          1220: {
            slidesPerView: 5,
          },
        }}
        className="w-full"
      >
        {categories.map((cat, index) => (
          <SwiperSlide key={index} className="!w-auto">
            <CategoryCard {...cat} showTag={title === "Popular Top 10 In Genres"} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Controls - Mobile Only */}
      <div className="md:hidden flex justify-center item-center gap-1">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all ${
              idx === currentSlide % 4
                ? "w-6 bg-red-600"
                : "w-4 bg-[#333]"
            }`}
          ></div>
        ))}
      </div>

    </div>
  );
};

export default WideVarCard;