// API service for movies
const API_BASE_URL = "https://week4hackathonbackend.vercel.app/api/movies";

console.log("🎬 MovieService initialized with API Base URL:", API_BASE_URL);

export const movieService = {
  // Get all movies
  getAllMovies: async () => {
    try {
      console.log("📡 Fetching all movies...");
      const response = await fetch(`${API_BASE_URL}/`);
      console.log("Response status:", response.status);
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch movies`);
      const data = await response.json();
      console.log("✅ Movies fetched successfully:", data);
      return data;
    } catch (error) {
      console.error("❌ Error fetching movies:", error);
      throw error;
    }
  },

  // Get movies by type (movie or show)
  getMoviesByType: async (contentType) => {
    try {
      const url = `${API_BASE_URL}/type/${contentType}`;
      console.log(`📡 Fetching ${contentType}s from:`, url);
      const response = await fetch(url);
      console.log(`Response status for ${contentType}:`, response.status);
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch ${contentType}s`);
      const data = await response.json();
      console.log(`✅ ${contentType}s fetched:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Error fetching ${contentType}s:`, error);
      throw error;
    }
  },

  // Get single movie by ID
  getMovieById: async (movieId) => {
    try {
      const url = `${API_BASE_URL}/${movieId}`;
      console.log("📡 Fetching movie from:", url);
      const response = await fetch(url);
      console.log("Response status:", response.status);
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch movie`);
      const data = await response.json();
      console.log("✅ Movie fetched:", data);
      return data;
    } catch (error) {
      console.error("❌ Error fetching movie:", error);
      throw error;
    }
  },

  // Get movies by genre
  getMoviesByGenre: async (genre) => {
    try {
      const url = `${API_BASE_URL}/genre/${genre}`;
      console.log("📡 Fetching movies by genre from:", url);
      const response = await fetch(url);
      console.log("Response status:", response.status);
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch movies`);
      const data = await response.json();
      console.log("✅ Movies by genre fetched:", data);
      return data;
    } catch (error) {
      console.error("❌ Error fetching movies by genre:", error);
      throw error;
    }
  },

  // Get all genres
  getAllGenres: async () => {
    try {
      const url = `${API_BASE_URL}/genres/list`;
      console.log("📡 Fetching genres from:", url);
      const response = await fetch(url);
      console.log("Response status:", response.status);
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch genres`);
      const data = await response.json();
      console.log("✅ Genres fetched:", data);
      return data;
    } catch (error) {
      console.error("❌ Error fetching genres:", error);
      throw error;
    }
  },

  // Search movies
  searchMovies: async (query) => {
    try {
      const url = `${API_BASE_URL}/search`;
      console.log("📡 Searching movies from:", url, "Query:", query);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      console.log("Response status:", response.status);
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to search movies`);
      const data = await response.json();
      console.log("✅ Search results:", data);
      return data;
    } catch (error) {
      console.error("❌ Error searching movies:", error);
      throw error;
    }
  },
};

export default movieService;
