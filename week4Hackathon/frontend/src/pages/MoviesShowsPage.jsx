import React, { useState, useEffect } from 'react';
import MoviesShowsHero from '../components/MoviesShowsHero';
import MoviesList from '../components/MoviesList';
import WideVarCard from '../components/WideVarCard';
import SingleImageCarousel from '../components/SingleImageCarousel';
import { movieRows } from '../../data';
import BrandCarousel from '../components/BrandCarousel';
import movieService from '../services/movieService';

const MoviesShowsPage = () => {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        console.log("🎬 MoviesShowsPage: Starting to fetch movies and shows...");
        
        // Fetch movies and shows from API
        const [moviesData, showsData] = await Promise.all([
          movieService.getMoviesByType('movie'),
          movieService.getMoviesByType('show')
        ]);

        console.log("✅ MoviesShowsPage: API responses received:");
        console.log("   Movies:", moviesData);
        console.log("   Shows:", showsData);

        const moviesArray = moviesData.data || [];
        const showsArray = showsData.data || [];

        console.log(`📊 Setting state:`);
        console.log(`   Movies count: ${moviesArray.length}`);
        console.log(`   Shows count: ${showsArray.length}`);
        console.log(`   First movie:`, moviesArray[0]);
        console.log(`   First show:`, showsArray[0]);

        setMovies(moviesArray);
        setShows(showsArray);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching content:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-2xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black">
      <MoviesShowsHero />
      
      {/* Movies Container */}
      <MoviesList buttonLabel="Movies">
        <WideVarCard title='Our Genres' description=' '/>
        <WideVarCard title='Popular Top 10 In Genres' description=' '/>
        {movies.length > 0 && (
          <>
            <SingleImageCarousel title='Trending Movies' movies={movies} contentType='withPills' />
            <SingleImageCarousel contentType='releaseDate' title='New Releases' movies={movies} />
            <SingleImageCarousel contentType='withRating' title='Must - Watch Movies' movies={movies} />
          </>
        )}
      </MoviesList>

      {/* Shows Container */}
      <MoviesList buttonLabel="Shows">
        <WideVarCard title='Our Genres' description=' '/>
        <WideVarCard title='Popular Top 10 In Genres' description=' '/>
        {shows.length > 0 && (
          <>
            <SingleImageCarousel title='Trending Shows Now' movies={shows} contentType='withPills' />
            <SingleImageCarousel title='New Released Shows' movies={shows} contentType='withPills' />
            <SingleImageCarousel contentType='withRating' title='Must - Watch Shows' movies={shows} />
          </>
        )}
      </MoviesList>

      <BrandCarousel images={movieRows.flat()}/>
    </div>
  );
};

export default MoviesShowsPage;
