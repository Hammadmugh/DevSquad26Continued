import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {movieRows} from "/data";
import {
  Play,
  ThumbsUp,
  Volume2,
  VolumeX,
  ChevronLeft,
  Star,
  Eye,
  Clock,
} from "lucide-react";
import BrandCarousel from "../components/BrandCarousel";
import movieService from "../services/movieService";
import { authService } from "../services/authService";

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("🎬 MovieDetailPage: Mounted with movieId:", movieId);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        console.log("🎬 MovieDetailPage: Fetching movie with ID:", movieId);
        setLoading(true);
        const movieData = await movieService.getMovieById(movieId);
        console.log("🎬 MovieDetailPage: Raw API Response:", movieData);
        
        // Extract the actual movie object from the response
        let actualMovie = null;
        
        if (movieData && typeof movieData === 'object') {
          // If response has a 'data' property, use that
          if (movieData.data) {
            actualMovie = movieData.data;
          } 
          // If response has 'success' property, it's a direct response
          else if (movieData.success) {
            actualMovie = movieData;
          }
          // Otherwise use the response directly
          else {
            actualMovie = movieData;
          }
        }
        
        console.log("🎬 MovieDetailPage: Extracted Movie Object:", actualMovie);
        console.log("🎬 MovieDetailPage: Movie Fields - Title:", actualMovie?.title, "Description:", actualMovie?.description, "Genres:", actualMovie?.genres, "Cast:", actualMovie?.cast);
        
        if (!actualMovie || !actualMovie._id) {
          throw new Error("Invalid movie data received from API");
        }
        
        setMovie(actualMovie);
      } catch (err) {
        console.error("❌ Failed to fetch movie:", err);
        setError("Failed to load movie details: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  // Log movie data whenever it changes
  useEffect(() => {
    if (movie) {
      console.log("🎬 MovieDetailPage: Movie state updated with all fields:");
      console.log("  Title:", movie.title);
      console.log("  Description:", movie.description);
      console.log("  Director:", movie.director);
      console.log("  Year:", movie.year);
      console.log("  Duration:", movie.duration);
      console.log("  Rating:", movie.rating);
      console.log("  Content Type:", movie.contentType);
      console.log("  Genres:", movie.genres);
      console.log("  Languages:", movie.languages);
      console.log("  Cast:", movie.cast);
      console.log("  Trailer URL:", movie.trailerUrl);
      console.log("  Image:", movie.image);
      console.log("  Full Movie Object:", movie);
    }
  }, [movie]);

  // Update video mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const handlePlayNow = () => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      // Redirect to login with return URL
      localStorage.setItem('redirectToSubscription', JSON.stringify({
        movieId: movie._id,
        movieTitle: movie.title
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

  // Loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading movie details...</div>
      </div>
    );
  }

  // Error state
  if (error || !movie) {
    return (
      <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="text-white text-xl">{error || "Movie not found"}</div>
        <button
          onClick={() => navigate(-1)}
          className="text-red-600 hover:text-red-500 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-h-screen bg-black">
        {/* Header with Back Button */}
        <div className="relative pt-32 px-4 sm:px-6 lg:px-0 lg:max-w-[1280px] md:max-w-[1024px] max-w-[358px] mx-auto">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-white hover:text-gray-300 transition mb-8"
          >
            <ChevronLeft size={24} />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative w-full h-[600px] md:h-[700px] lg:h-[600px] -mt-20">
          {/* Video or Background Image */}
          {movie.trailerUrl ? (
            <>
              {/* Trailer Video */}
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover z-0 cursor-pointer"
                autoPlay
                loop
                muted={isMuted}
                controls={false}
                onClick={handleVideoClick}
              >
                <source src={movie.trailerUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </>
          ) : (
            <>
              {/* Fallback to Poster Image */}
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url('${encodeURI(movie.image)}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-10"></div>

          {/* Content Container */}
          <div className="relative z-20 h-full flex flex-col justify-between pt-20 px-4 sm:px-6 lg:px-0 lg:max-w-[1280px] md:max-w-[1024px] max-w-[358px] mx-auto">
            {/* Bottom Action Buttons */}
            <div className="flex flex-col items-start gap-8 pb-12">
              {/* Movie Title */}
              <div className="max-w-[600px]">
                <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  {movie.title}
                </h1>
                <p className="text-gray-300 text-sm md:text-base line-clamp-3">
                  {movie.description || "A captivating story filled with drama, action, and emotions that will keep you engaged from start to finish."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handlePlayNow}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-[#E60000] hover:bg-red-700 text-white font-semibold rounded-lg transition"
                >
                  <Play size={20} className="fill-white" />
                  Play Now
                </button>
                <button className="flex items-center justify-center gap-2 px-8 py-3 border border-white/30 hover:border-white text-white font-semibold rounded-lg transition">
                  <ThumbsUp size={20} />
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="flex items-center justify-center gap-2 px-8 py-3 border border-white/30 hover:border-white text-white font-semibold rounded-lg transition"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="px-4 sm:px-6 lg:px-0 lg:max-w-[1280px] md:max-w-[1024px] max-w-[358px] mx-auto py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-white text-2xl font-bold mb-4">
                  Description
                </h2>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                  {movie.description || "No description available"}
                </p>
              </div>

              {/* Cast Section */}
              <div>
                <h2 className="text-white text-2xl font-bold mb-6">Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {(() => {
                    // Ensure cast is always an array
                    let castArray = [];
                    if (Array.isArray(movie.cast)) {
                      castArray = movie.cast;
                    } else if (typeof movie.cast === 'string' && movie.cast.trim()) {
                      castArray = movie.cast.split(',').map(c => c.trim()).filter(c => c);
                    }
                    
                    console.log("📺 Cast data:", movie.cast, "Parsed as:", castArray);
                    
                    return castArray.length > 0 ? (
                      castArray.map((actor, idx) => (
                        <div key={idx} className="flex flex-col items-center p-4 bg-[#141414] border border-[#262626] rounded-lg hover:border-[#404040] transition">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 mb-3 flex items-center justify-center">
                            <span className="text-gray-400 text-2xl font-bold">{String(actor).charAt(0).toUpperCase()}</span>
                          </div>
                          <p className="text-gray-300 text-sm font-medium text-center break-words" title={actor}>
                            {String(actor).trim()}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">Actor</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm col-span-full">No cast information available</p>
                    );
                  })()}
                </div>
              </div>

              {/* Reviews Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white text-2xl font-bold">Reviews</h2>
                  <button className="text-[#E60000] hover:text-red-700 font-semibold text-sm">
                    + Add Your Review
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Info Card 1: Release Year */}
              <div className="bg-[#141414] border border-[#262626] rounded-lg p-6">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">
                  Released Year
                </h3>
                <p className="text-white text-2xl font-bold">{movie.year || "N/A"}</p>
              </div>

              {/* Duration */}
              <div className="bg-[#141414] border border-[#262626] rounded-lg p-6">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">
                  Duration
                </h3>
                <p className="text-white text-2xl font-bold">{movie.duration || "N/A"}</p>
              </div>

              {/* Info Card 2: Languages */}
              <div className="bg-[#141414] border border-[#262626] rounded-lg p-6">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-3">
                  Available Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    let langArray = [];
                    if (Array.isArray(movie.languages)) {
                      langArray = movie.languages;
                    } else if (typeof movie.languages === 'string' && movie.languages.trim()) {
                      langArray = movie.languages.split(',').map(l => l.trim()).filter(l => l);
                    }
                    
                    return langArray && langArray.length > 0 ? (
                      langArray.map((lang, idx) => (
                        <span
                          key={idx}
                          className="text-white text-xs bg-[#262626] px-3 py-1.5 rounded-full"
                        >
                          {lang}
                        </span>
                      ))
                    ) : (
                      <span className="text-white text-xs bg-[#262626] px-3 py-1.5 rounded-full">
                        English
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Info Card 3: Ratings */}
              <div className="bg-[#141414] border border-[#262626] rounded-lg p-6">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-4">
                  Ratings
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs">StreamVibe</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => {
                          const ratingValue = parseFloat(movie.rating || 0);
                          const filledStars = Math.round(ratingValue / 2); // Convert 0-10 to 0-5
                          return (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < filledStars
                                  ? "text-[#E60000] fill-[#E60000]"
                                  : "text-gray-600"
                              }
                            />
                          );
                        })}
                        <span className="text-white text-xs font-bold ml-1">
                          {movie.rating || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Card 4: Genres */}
              <div className="bg-[#141414] border border-[#262626] rounded-lg p-6">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-3">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    let genreArray = [];
                    if (Array.isArray(movie.genres)) {
                      genreArray = movie.genres;
                    } else if (typeof movie.genres === 'string' && movie.genres.trim()) {
                      genreArray = movie.genres.split(',').map(g => g.trim()).filter(g => g);
                    }
                    
                    console.log("📺 Genres data:", movie.genres, "Parsed as:", genreArray);
                    
                    return genreArray && genreArray.length > 0 ? (
                      genreArray.map((genre, idx) => (
                        <span
                          key={idx}
                          className="text-white text-xs bg-[#262626] px-3 py-1.5 rounded-full"
                        >
                          {genre}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">No genres available</span>
                    );
                  })()}
                </div>
              </div>

              {/* Info Card 5: Director */}
              <div className="bg-[#141414] border border-[#262626] rounded-lg p-6">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">
                  Director
                </h3>
                <p className="text-white font-semibold">{movie.director || "Unknown"}</p>
                <p className="text-gray-400 text-xs">From India</p>
              </div>

              {/* Info Card 6: Content Type */}
              <div className="bg-[#141414] border border-[#262626] rounded-lg p-6">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">
                  Content Type
                </h3>
                <p className="text-white font-semibold capitalize">{movie.contentType || "Movie"}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {movie.contentType === "show" ? "TV Series" : "Full Length"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BrandCarousel images={movieRows.flat()} />
    </>
  );
};

export default MovieDetailPage;
