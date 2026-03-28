const express = require("express");
const Movie = require("../models/movieModel");

const router = express.Router();

// GET all movies
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// SPECIFIC ROUTES FIRST (before generic /:id)

// GET all genres
router.get("/genres/list", async (req, res) => {
  try {
    const genres = await Movie.distinct("genres", { isActive: true });
    
    res.status(200).json({
      success: true,
      count: genres.length,
      data: genres,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// SEARCH movies by title
router.post("/search", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Search query cannot be empty",
      });
    }

    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
      isActive: true,
    }).limit(20);

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET movies by type (movie or show)
router.get("/type/:contentType", async (req, res) => {
  try {
    const { contentType } = req.params;
    
    if (!["movie", "show"].includes(contentType)) {
      return res.status(400).json({
        success: false,
        error: "Invalid content type. Must be 'movie' or 'show'",
      });
    }

    const movies = await Movie.find({ 
      contentType, 
      isActive: true 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET movies by genre
router.get("/genre/:genre", async (req, res) => {
  try {
    const { genre } = req.params;

    const movies = await Movie.find({
      genres: { $in: [genre] },
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GENERIC ROUTE LAST (/:id)

// GET single movie by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if id is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: "Invalid movie ID format",
      });
    }

    const movie = await Movie.findById(id);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        error: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
