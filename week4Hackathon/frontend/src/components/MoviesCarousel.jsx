import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Clock, Monitor } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';

const MovieCard = ({ image, title, duration, seasons, rating, reviews }) => {
  return (
    <div className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-5 flex flex-col gap-5 w-[359px] h-[444px]">
      {/* Image */}
      <div
        className="w-full h-[348px] rounded-xl bg-cover bg-center"
        style={{ backgroundImage: `url('${image}')` }}
      />

      {/* Info Container */}
      <div className="flex flex-row justify-between gap-[97px] w-full">
        {/* First Info Pill */}
        <div className="bg-[#141414] border border-[#262626] rounded-full px-[10px] py-[6px] flex items-center gap-[2px] w-fit">
          <div className="w-[24px] h-[24px] flex items-center justify-center">
            <Clock size={18} className="text-[#999999]" />
          </div>
          <span className="text-[#999999] text-sm font-medium">{duration}</span>
        </div>

        {/* Second Info Pill */}
        <div className="bg-[#141414] border border-[#262626] rounded-full px-[10px] py-[6px] flex items-center gap-[4px] w-fit">
          <div className="w-[24px] h-[24px] flex items-center justify-center">
            <Monitor size={18} className="text-[#999999]" />
          </div>
          <span className="text-[#999999] text-sm font-medium">{seasons}</span>
        </div>
      </div>
    </div>
  );
};

const MoviesCarousel = ({ title = 'Popular Movies', movies = [] }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (swiper) => {
    setCurrentSlide(swiper.realIndex % 4);
  };

  return (
    <div className="w-full flex flex-col gap-[50px]">
      {/* Header Section */}
      <div className="flex flex-row items-center gap-[100px] w-full justify-between flex-wrap md:flex-nowrap">
        {/* Title */}
        <h2 className="text-white text-[38px] font-bold leading-[57px]">{title}</h2>

        {/* Controls Container - Desktop Only */}
        <div className="hidden md:flex bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-4 items-center gap-4 w-fit">
          {/* Previous Button */}
          <button
            ref={prevRef}
            className="bg-[#1A1A1A] border border-[#1F1F1F] rounded-lg p-3.5 hover:bg-[#262626] transition w-14 h-14 flex items-center justify-center"
          >
            <ChevronLeft size={28} className="text-white" />
          </button>

          {/* Indicators */}
          <div className="flex items-start gap-[3px]">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all ${
                  idx === currentSlide ? 'w-[23px] bg-[#E60000]' : 'w-[16.33px] bg-[#333333]'
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            ref={nextRef}
            className="bg-[#1A1A1A] border border-[#1F1F1F] rounded-lg p-3.5 hover:bg-[#262626] transition w-14 h-14 flex items-center justify-center"
          >
            <ChevronRight size={28} className="text-white" />
          </button>
        </div>
      </div>

      {/* Movies Carousel */}
      <Swiper
        modules={[Navigation]}
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
        spaceBetween={20}
        slidesPerView="auto"
        loop={true}
      >
        {movies.map((movie, idx) => (
          <SwiperSlide key={idx} className="!w-auto">
            <MovieCard {...movie} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Controls - Mobile Only */}
      <div className="md:hidden flex justify-center items-center gap-1">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all ${
              idx === currentSlide ? 'w-[23px] bg-[#E60000]' : 'w-[16.33px] bg-[#333333]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MoviesCarousel;
