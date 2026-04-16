import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Clock, Monitor, Star, Eye } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";

const MovieCardSingle = ({ image, contentType = "withPills", _id, movieIndex, ...props }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    const movieIdToUse = _id || movieIndex;
    console.log(`🎬 Card clicked! Navigating to /movie/${movieIdToUse}, _id:`, _id, "index:", movieIndex);
    navigate(`/movie/${movieIdToUse}`);
  };

  const renderContent = () => {
    switch (contentType) {
      case "releaseDate":
        return (
          <div>
            <p className="text-[#999999] text-[16px] font-medium">
              {props.releaseDate}
            </p>
          </div>
        );
      case "withRating":
        const filledStars = 4;
        const totalStars = 5;
        return (
          <div className="flex flex-row gap-4 justify-between items-center w-full">
            {/* Duration Pill - Left Side */}
            <div className="bg-[#141414] border border-[#262626] rounded-full px-3 py-2 flex items-center gap-2 w-fit">
              <Clock size={16} className="text-[#999999]" />
              <span className="text-[#999999] text-xs font-medium">{props.duration}</span>
            </div>

            {/* Rating Pill - Right Side */}
            <div className="bg-[#141414] border border-[#262626] rounded-full px-2.5 py-1.5 flex items-center gap-1 w-fit">
              {/* Stars Container */}
              <div className="flex gap-0.5">
                {Array.from({ length: totalStars }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={14}
                    className={idx < filledStars ? "fill-[#E60000] text-[#E60000]" : "text-[#999999]"}
                  />
                ))}
              </div>
              {/* Rating Text */}
              <span className="text-[#999999] text-xs font-medium ml-1">
                {props.rating}
              </span>
            </div>
          </div>
        );
      case "withPills":
        const movieContentType = props.contentType || 'movie';
        const pillType = props.pillType || (movieContentType === 'show' ? 'seasons' : 'views');
        const pillLabel = pillType === "views" ? props.views : props.seasons;
        const IconComponent = pillType === "views" ? Eye : Monitor;
        return (
          <>
            {/* Title */}
            <div>
              <h3 className="text-white text-[18px] font-semibold truncate">
                {props.title}
              </h3>
            </div>

            {/* Info Container */}
            <div className="flex flex-row gap-4 justify-between">
              {/* Duration Pill */}
              <div className="bg-[#141414] border border-[#262626] rounded-full px-3 py-2 flex items-center gap-2 w-fit">
                <Clock size={16} className="text-[#999999]" />
                <span className="text-[#999999] text-xs font-medium">{props.duration}</span>
              </div>

              {/* Seasons or Views Pill */}
              <div className="bg-[#141414] border border-[#262626] rounded-full px-3 py-2 flex items-center gap-2 w-fit">
                <IconComponent size={16} className="text-[#999999]" />
                <span className="text-[#999999] text-xs font-medium">{pillLabel}</span>
              </div>
            </div>
          </>
        );
      default:
        return props.children || null;
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-[#1A1A1A] border border-[#262626] rounded-xl p-6 flex flex-col gap-4 hover:scale-105 transition duration-300 cursor-pointer"
    >
      
      {/* Single Image */}
      <div
        className="w-full h-64 rounded-lg bg-cover bg-center bg-gray-800"
        style={{ 
          backgroundImage: `url('${encodeURI(image)}')`,
          backgroundColor: '#1A1A1A'
        }}
        onError={() => console.warn(`❌ Image failed to load: ${image}`)}
      />

      {/* Dynamic Content */}
      {renderContent()}
    </div>
  );
};

const SingleImageCarousel = ({ 
  title = "Trending Now", 
  description = "",
  contentType = "withPills",
  movies = []
}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Debug logging
  console.log(`🎬 SingleImageCarousel "${title}" rendering:`, {
    title,
    contentType,
    moviesCount: movies.length,
    firstMovie: movies[0] || "No movies",
    allMovies: movies
  });

  const handleSlideChange = (swiper) => {
    setCurrentSlide(swiper.realIndex % Math.max(movies.length, 1));
  };

  // If no movies, show empty state
  if (!movies || movies.length === 0) {
    console.warn(`⚠️ No movies to display for carousel: "${title}"`);
    return (
      <div className="text-white text-center py-8">
        <p>No {title.toLowerCase()} available</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto md:my-[10px] my-[10px] px-4 flex flex-col gap-20">

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
            <img src="/right arrow.png" alt="right" className="w-6 h-6"/>
          </button>

        </div>
      </div>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Navigation]}
        loop={movies.length > 4}
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
        {movies.map((movie, index) => (
          <SwiperSlide key={movie._id || index} className="!w-auto">
            <MovieCardSingle movieIndex={index} {...movie} contentType={contentType} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Controls - Mobile Only */}
      <div className="md:hidden flex justify-center items-center gap-1">
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

export default SingleImageCarousel;
