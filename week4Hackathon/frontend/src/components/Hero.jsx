import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { movieRows } from '../../data';
import { authService } from '../services/authService';
import 'swiper/css';

export default function Hero() {
  const navigate = useNavigate();

  const handleStartWatching = () => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      // Redirect to login with flag set
      localStorage.setItem('redirectToSubscription', JSON.stringify({
        source: 'hero'
      }));
      navigate('/login');
      return;
    }

    // Check if user has active subscription
    const subscription = localStorage.getItem('userSubscription');
    if (!subscription || JSON.parse(subscription).status !== 'active') {
      // No subscription, redirect to subscriptions page
      navigate('/subscriptions');
      return;
    }

    // User is authenticated and has subscription
    // TODO: Navigate to actual video player
    alert('Video player would start here. (Feature coming soon)');
  };

  return (
    <div className="w-full bg-black">
      {/* Hero Container */}
      <div className="relative w-full overflow-hidden h-screen md:h-[720px] flex items-center justify-start">
        
        {/* Image Carousel Grid */}
        <div className="absolute inset-0 flex flex-col gap-3 md:gap-4 justify-center">
          {/* Row 1: LTR */}
          <div className="w-full">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={10}
              slidesPerView="auto"
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
              }}
              speed={9000}
              loop={true}
              className="w-full"
              breakpoints={{
                320: { slidesPerView: 1.5, spaceBetween: 12 },
                640: { slidesPerView: 2.5, spaceBetween: 16 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
                1280: { slidesPerView: 9, spaceBetween: 20 },
              }}
            >
              {movieRows[0].map((image, idx) => (
                <SwiperSlide key={idx} className="!w-40 !max-w-40 h-48 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-900 rounded-xl flex items-center justify-center overflow-hidden">
                    <img
                      src={image}
                      alt={`Movie ${idx + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Row 2: RTL */}
          <div className="w-full">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={10}
              slidesPerView="auto"
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                reverseDirection: true,
              }}
              speed={9000}
              loop={true}
              className="w-full"
              breakpoints={{
                320: { slidesPerView: 1.5, spaceBetween: 12 },
                640: { slidesPerView: 2.5, spaceBetween: 16 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
                1280: { slidesPerView: 9, spaceBetween: 20 },
              }}
            >
              {movieRows[1].map((image, idx) => (
                <SwiperSlide key={idx} className="!w-40 !max-w-40 h-48 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-900 rounded-xl flex items-center justify-center overflow-hidden">
                    <img
                      src={image}
                      alt={`Movie ${idx + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Row 3: LTR */}
          <div className="w-full">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={10}
              slidesPerView="auto"
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
              }}
              speed={9000}
              loop={true}
              className="w-full"
              breakpoints={{
                320: { slidesPerView: 1.5, spaceBetween: 12 },
                640: { slidesPerView: 2.5, spaceBetween: 16 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
                1280: { slidesPerView: 9, spaceBetween: 20 },
              }}
            >
              {movieRows[2].map((image, idx) => (
                <SwiperSlide key={idx} className="!w-40 !max-w-40 h-48 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-900 rounded-xl flex items-center justify-center overflow-hidden">
                    <img
                      src={image}
                      alt={`Movie ${idx + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Row 4: RTL */}
          <div className="w-full">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView="auto"
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                reverseDirection: true,
              }}
              speed={9000}
              loop={true}
              className="w-full"
              breakpoints={{
                320: { slidesPerView: 1.5, spaceBetween: 12 },
                640: { slidesPerView: 2.5, spaceBetween: 16 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
                1280: { slidesPerView: 9, spaceBetween: 20 },
              }}
            >
              {movieRows[3].map((image, idx) => (
                <SwiperSlide key={idx} className="!w-40 !max-w-40 h-48 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-900 rounded-xl flex items-center justify-center overflow-hidden">
                    <img
                      src={image}
                      alt={`Movie ${idx + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Overlay & Backdrop Effects */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Black Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          {/* Gradient Top */}
          <div className="absolute top-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-b from-black via-black/50 to-transparent"></div>
          
          {/* Gradient Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          
          {/* Center Logo Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/overlayLogo.png" alt="StreamVibe Overlay" className="h-20 md:h-40 opacity-80" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 w-full bg-gradient-to-b from-black/60 via-black/80 to-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col items-center gap-8">
          
          {/* Text Container */}
          <div className="w-full flex flex-col items-center gap-4 md:gap-6 text-center">
            
            {/* Heading */}
            <h1 className="text-[28px] md:text-[48px] lg:text-[58px] font-bold text-white leading-tight font-manrope">
              The Best Streaming Experience
            </h1>

            {/* Paragraph */}
            <p className="lg:text-[18px] text-[14px] text-neutral-400 leading-relaxed font-light">
              <span className="block md:hidden">
                StreamVibe is the best streaming experience for watching your favorite movies and shows on demand, anytime, anywhere.
              </span>
              <span className="hidden md:block">
                StreamVibe is the best streaming experience for watching your favorite movies and shows on demand, anytime, anywhere. With StreamVibe, you can enjoy a wide variety of content, including the latest blockbusters, classic movies, popular TV shows, and more. You can also create your own watchlists, so you can easily find the content you want to watch.
              </span>
            </p>
          </div>

          {/* Button */}
          <button 
            onClick={handleStartWatching}
            className="flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-red-600 hover:bg-red-700 transition-all text-white font-semibold rounded-lg text-base md:text-lg shadow-lg hover:shadow-red-600/50">
            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
            <span>Start Watching Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
