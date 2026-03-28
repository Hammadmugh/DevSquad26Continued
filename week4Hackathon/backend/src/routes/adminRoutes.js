const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middlewares/adminMiddleware");
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getDashboardStats,
  getAllMovies,
  updateMovie,
  deleteMovie,
} = require("../controllers/adminController");

// All routes require admin authentication
router.use(adminMiddleware);

// User management routes
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserById);
router.put("/users/:userId/role", updateUserRole);
router.delete("/users/:userId", deleteUser);

// Dashboard statistics
router.get("/dashboard/stats", getDashboardStats);

// Movie management routes
router.get("/movies", getAllMovies);
router.put("/movies/:movieId", updateMovie);
router.delete("/movies/:movieId", deleteMovie);

module.exports = router;
