// API service for authentication
import { API_CONFIG } from "../config/apiConfig";

const API_BASE_URL = `${API_CONFIG.AUTH_BASE_URL}`;

export const authService = {
  // Register user
  register: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      return data;
    } catch (error) {
      console.error("❌ Registration error:", error);
      throw error;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      
      // Store token and user info
      if (data.data.token) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }
      return data;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Get token
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === "admin";
  },

  // Get user profile with subscription details
  getUserProfile: async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("🔐 Token found, fetching profile from:", `${API_BASE_URL}/profile`);
      
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      console.log("📡 Profile response status:", response.status, response.statusText);
      
      const data = await response.json();
      console.log("📦 Profile response data:", data);
      
      if (!response.ok) throw new Error(data.message || "Failed to fetch profile");
      return data.data.user;
    } catch (error) {
      console.error("❌ Error fetching user profile:", error.message);
      throw error;
    }
  },
};
