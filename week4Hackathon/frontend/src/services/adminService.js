import { authService } from "./authService";
import { API_CONFIG } from "../config/apiConfig";

// API service for admin operations
const API_BASE_URL = `${API_CONFIG.ADMIN_BASE_URL}`;

const getHeaders = () => {
  const token = authService.getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const adminService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch users");
      return data;
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch user");
      return data;
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      throw error;
    }
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ role }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update user role");
      return data;
    } catch (error) {
      console.error("❌ Error updating user role:", error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete user");
      return data;
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      throw error;
    }
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch stats");
      return data;
    } catch (error) {
      console.error("❌ Error fetching stats:", error);
      throw error;
    }
  },

  // Get all movies
  getAllMovies: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch movies");
      return data;
    } catch (error) {
      console.error("❌ Error fetching movies:", error);
      throw error;
    }
  },

  // Update movie
  updateMovie: async (movieId, updateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update movie");
      return data;
    } catch (error) {
      console.error("❌ Error updating movie:", error);
      throw error;
    }
  },

  // Delete movie
  deleteMovie: async (movieId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete movie");
      return data;
    } catch (error) {
      console.error("❌ Error deleting movie:", error);
      throw error;
    }
  },
};
