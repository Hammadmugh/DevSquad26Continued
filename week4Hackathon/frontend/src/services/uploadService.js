import { authService } from "./authService";
import { API_CONFIG } from "../config/apiConfig";

// API service for uploading movies
const API_BASE_URL = `${API_CONFIG.UPLOAD_BASE_URL}`;

const getHeaders = () => {
  const token = authService.getToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const uploadService = {
  // NEW: Get Cloudinary signature for direct upload from frontend
  getCloudinarySignature: async (fileType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/signature`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getHeaders().Authorization,
        },
        body: JSON.stringify({ type: fileType }), // 'poster', 'trailer', or 'banner'
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to get signature");
      return data.data;
    } catch (error) {
      console.error("❌ Error getting Cloudinary signature:", error);
      throw error;
    }
  },

  // NEW: Upload file directly to Cloudinary using signature
  uploadToCloudinary: async (file, fileType) => {
    try {
      const signatureData = await uploadService.getCloudinarySignature(fileType);
      const { signature, timestamp, cloudName, apiKey, params } = signatureData;

      // Build the correct upload URL using the cloud name from backend
      const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("api_key", apiKey);

      // Add all params
      Object.entries(params).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Failed to upload to Cloudinary");

      console.log(`✅ ${fileType} uploaded to Cloudinary:`, data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error(`❌ Error uploading ${fileType} to Cloudinary:`, error);
      throw error;
    }
  },

  // NEW: Save movie with pre-uploaded Cloudinary URLs
  saveMovieWithUrls: async (movieData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getHeaders().Authorization,
        },
        body: JSON.stringify(movieData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to save movie");
      return data;
    } catch (error) {
      console.error("❌ Error saving movie:", error);
      throw error;
    }
  },

  // LEGACY: Upload movie/show with poster, trailer and banner (for backward compatibility)
  uploadMovie: async (movieData, imageFile, trailerFile, bannerFile) => {
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append("title", movieData.title);
      formData.append("description", movieData.description);
      formData.append("duration", movieData.duration);
      formData.append("genres", movieData.genres.join(', '));
      formData.append("director", movieData.director);
      formData.append("cast", movieData.cast.join(', '));
      formData.append("year", movieData.year);
      formData.append("contentType", movieData.contentType);
      formData.append("rating", movieData.rating);
      
      // Add poster image file (required)
      if (imageFile) {
        formData.append("image", imageFile);
      }
      
      // Add trailer file (optional)
      if (trailerFile) {
        formData.append("trailer", trailerFile);
      }
      
      // Add banner file (optional)
      if (bannerFile) {
        formData.append("banner", bannerFile);
      }

      const response = await fetch(`${API_BASE_URL}/movie`, {
        method: "POST",
        headers: {
          Authorization: getHeaders().Authorization,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to upload movie");
      return data;
    } catch (error) {
      console.error("❌ Error uploading movie:", error);
      throw error;
    }
  },
};
