import { authService } from "./authService";

// API service for uploading movies
const API_BASE_URL = "https://week4hackathonbackend.vercel.app/api/upload";

const getHeaders = () => {
  const token = authService.getToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const uploadService = {
  // Upload movie/show with poster, trailer and banner
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
