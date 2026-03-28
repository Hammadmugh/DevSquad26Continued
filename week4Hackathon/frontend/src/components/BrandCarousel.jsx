import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const BrandCarousel = ({ 
  title = "Start your free trial today!",
  description = "This is a clear and concise call to action that encourages users to sign up for a free trial of StreamVibe.",
  buttonText = "Start a Free Trail",
  images = [] // Array of image URLs
}) => {
  
  // Duplicate images for smooth infinite looping
  const doubledImages = [...images, ...images];
  
  // Create 4 rows of images
  const rows = [
    doubledImages.slice(0, 18),
    doubledImages.slice(18, 36),
    doubledImages.slice(36, 54),
    doubledImages.slice(54, 72)
  ].filter(row => row.length > 0);

  return (
    <div className="w-full bg-black py-12 md:py-16 lg:py-20">
      <div className="lg:max-w-[1280px] md:max-w-[1024px] max-w-[358px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Container */}
        <div className="relative w-full h-auto lg:h-[236px] bg-[#0F0F0F] border border-[#262626] rounded-lg lg:rounded-[12px] p-8 sm:p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-[100px]">
          
          {/* Background Images Container */}
          <div className="absolute inset-0 flex flex-col gap-5 justify-center overflow-hidden rounded-lg lg:rounded-[12px] z-0 opacity-20">
            {rows.map((row, rowIdx) => (
              <div key={rowIdx} className="w-full">
                <Swiper
                  modules={[Autoplay]}
                  spaceBetween={20}
                  slidesPerView="auto"
                  autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                    reverseDirection: rowIdx % 2 !== 0,
                  }}
                  speed={9000}
                  loop={true}
                  watchSlidesProgress={true}
                  className="w-full"
                >
                  {row.map((image, idx) => (
                    <SwiperSlide key={idx} className="!w-[124px] !max-w-[124px] h-[73px] flex-shrink-0">
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={image}
                          alt={`Brand ${idx + 1}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ))}
          </div>

          {/* Fade Out Right */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-full h-full rounded-lg lg:rounded-[12px] z-10 pointer-events-none hidden lg:block"
            style={{
              background: 'linear-gradient(89.97deg, #0F0F0F 2.42%, rgba(20, 15, 15, 0.974681) 25.46%, rgba(34, 14, 14, 0.609574) 46.72%, rgba(229, 0, 0, 0) 168.98%)'
            }}
          />

          {/* Content Section */}
          <div className="relative z-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8 w-full">
            
            {/* Text Container */}
            <div className="flex flex-col gap-2.5 lg:gap-[10px]">
              <h2 className="text-white text-2xl sm:text-3xl lg:text-[28px] font-bold font-manrope leading-[150%]">
                {title}
              </h2>
              <p className="text-[#999999] text-sm sm:text-base lg:text-[16px] font-manrope leading-[150%]">
                {description}
              </p>
            </div>

            {/* Button */}
            <button className="flex items-center justify-center whitespace-nowrap px-5 py-3 lg:px-5 lg:py-3 bg-[#E60000] hover:bg-red-700 text-white font-manrope font-semibold text-sm lg:text-[14px] rounded-lg transition flex-shrink-0">
              {buttonText}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default BrandCarousel;
