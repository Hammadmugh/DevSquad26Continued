const User = require("../models/userModel");
const Movie = require("../models/movieModel");
const { constants } = require("../middlewares/constants");

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      data: users,
      message: "Users retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get user by ID
const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      res.status(constants.NOT_FOUND);
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "User retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Update user role
const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Invalid role. Must be 'user' or 'admin'");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      res.status(constants.NOT_FOUND);
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "User role updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      res.status(constants.NOT_FOUND);
      throw new Error("User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalRegularUsers = await User.countDocuments({ role: "user" });
    const totalMovies = await Movie.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalAdmins,
        totalRegularUsers,
        totalMovies,
      },
      message: "Dashboard statistics retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Get all movies (admin)
const getAllMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: movies,
      message: "Movies retrieved successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Update movie (admin)
const updateMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const updateData = req.body;

    // Validate movieId
    if (!movieId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Invalid movie ID format");
    }

    const movie = await Movie.findByIdAndUpdate(
      movieId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!movie) {
      res.status(constants.NOT_FOUND);
      throw new Error("Movie not found");
    }

    res.status(200).json({
      success: true,
      data: movie,
      message: "Movie updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Delete movie (admin)
const deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    // Validate movieId
    if (!movieId.match(/^[0-9a-fA-F]{24}$/)) {
      res.status(constants.VALIDATION_ERROR);
      throw new Error("Invalid movie ID format");
    }

    const movie = await Movie.findByIdAndDelete(movieId);

    if (!movie) {
      res.status(constants.NOT_FOUND);
      throw new Error("Movie not found");
    }

    res.status(200).json({
      success: true,
      data: movie,
      message: "Movie deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getDashboardStats,
  getAllMovies,
  updateMovie,
  deleteMovie,
};
