import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Play, ThumbsUp, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { authService } from '../services/authService';
import 'swiper/css';
import 'swiper/css/navigation';

const MoviesShowsHero = ({ images = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [userSubscription, setUserSubscription] = useState(null);
  const [checkedSubscription, setCheckedSubscription] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const navigate = useNavigate();

  // Fixed Cloudinary trailer URL - used for all movies
  const TRAILER_URL = "https://res.cloudinary.com/dkct55yjr/video/upload/v1774631437/streamvibe/trailers/wafsvgfwxpnq6shhgmjt.mp4";

  // Fetch user subscription on component mount
  useEffect(() => {
    const fetchUserSubscription = async () => {
      if (authService.isAuthenticated()) {
        try {
          const profile = await authService.getUserProfile();
          console.log("👤 User profile fetched:", profile);
          setUserSubscription(profile);
        } catch (err) {
          console.error("❌ Error fetching subscription:", err);
          setUserSubscription(null);
        }
      }
      setCheckedSubscription(true);
    };

    fetchUserSubscription();
  }, []);

  // Use default images if none provided
  const heroImages = images.length > 0 ? images : [
    '/movie hero.png',
    '/movie hero.png',
    '/movie hero.png',
    '/movie hero.png',
  ];

  const totalSlides = heroImages.length;

  const movieData = [
    {
      title: "Avengers : Endgame",
      description: "With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe, no matter what consequences may be in store."
    },
    {
      title: "Movie Title",
      description: "Movie description goes here"
    },
    {
      title: "Movie Title",
      description: "Movie description goes here"
    },
    {
      title: "Movie Title",
      description: "Movie description goes here"
    }
  ];

  const handleStartPlaying = () => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      // Redirect to login
      navigate('/login');
      return;
    }

    // Check if subscription has been fetched
    if (!checkedSubscription) {
      alert("Checking subscription status...");
      return;
    }

    // Check if user has active subscription
    if (!userSubscription || userSubscription.subscriptionStatus !== 'active') {
      console.log("❌ User subscription status:", userSubscription?.subscriptionStatus);
      navigate('/subscriptions');
      return;
    }

    // User is authenticated and has active subscription - show video player
    console.log("▶️ Playing trailer from hero section");
    setShowVideoPlayer(true);
  };

  return (
    <div className="relative w-full bg-black pt-32 pb-20 flex justify-center">
      {/* Outer Container - Centers the hero section */}
      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-10 lg:px-20">
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
          onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
          loop={true}
          className="w-full"
        >
          {heroImages.map((image, idx) => (
            <SwiperSlide key={idx} className="w-full">
              {/* Hero Container - Exact dimensions with rounded corners */}
              <div
                className="relative w-full h-64 md:h-80 lg:h-[520px] flex flex-col items-center justify-center overflow-hidden rounded-2xl"
                style={{
                  background: `linear-gradient(180deg, rgba(20, 20, 20, 0) 0%, #141414 100%), url('${image}')`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Content Container - Centered in the middle */}
                <div className="flex flex-col items-center gap-6 md:gap-8 px-4 md:px-8 max-w-3xl z-10">
                  
                  {/* Title */}
                  <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold text-center leading-tight font-manrope">
                    {movieData[idx]?.title || "Movie Title"}
                  </h1>

                  {/* Description */}
                  <p className="text-[#999999] text-sm md:text-base lg:text-lg text-center leading-relaxed font-manrope max-w-2xl">
                    {movieData[idx]?.description || "Movie description"}
                  </p>

                  {/* Controls Row - Play button left, Like/Sound right */}
                  <div className="flex items-center justify-center gap-8 w-full">
                    
                    {/* Play Button */}
                    <button 
                      onClick={handleStartPlaying}
                      className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-[#E60000] hover:bg-red-700 rounded-lg transition duration-300">
                      <Play size={20} className="text-white fill-white" />
                      <span className="text-white font-manrope font-semibold text-base md:text-lg hidden sm:inline">
                        Play Now
                      </span>
                    </button>

                    {/* Like and Sound Buttons */}
                    <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition">
                      <ThumbsUp size={20} className="text-white fill-white" />
                    </button>

                    <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-lg transition">
                      <Volume2 size={20} className="text-white" />
                    </button>

                  </div>

                </div>

                {/* Left Arrow - Hidden on mobile */}
                <button
                  ref={prevRef}
                  className="hidden md:flex absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 items-center justify-center bg-black/50 hover:bg-black/70 rounded-lg transition z-20"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Right Arrow - Hidden on mobile */}
                <button
                  ref={nextRef}
                  className="hidden md:flex absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 items-center justify-center bg-black/50 hover:bg-black/70 rounded-lg transition z-20"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Bottom Navigation Indicators - Positioned at bottom */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(4, totalSlides) }).map((_, idx) => (
              <div
                key={idx}
                className={`rounded-full transition-all ${
                  idx === currentSlide % totalSlides
                    ? 'w-6 h-1 bg-[#E60000]'
                    : 'w-4 h-1 bg-[#333333]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {showVideoPlayer && (
        <VideoPlayer
          videoUrl={TRAILER_URL}
          title={movieData[currentSlide]?.title || "Movie Title"}
          onClose={() => setShowVideoPlayer(false)}
        />
      )}
    </div>
  );
};

export default MoviesShowsHero;
