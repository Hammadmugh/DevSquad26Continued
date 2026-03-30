// API Configuration - switches between local and production
const getApiBaseUrl = () => {
  // Use environment variable if available (Vite loads VITE_* prefixed vars)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Default to production
  return "https://week4hackathonbackend.vercel.app/api";
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  AUTH_BASE_URL: `${getApiBaseUrl()}/auth`,
  MOVIES_BASE_URL: `${getApiBaseUrl()}/movies`,
  ADMIN_BASE_URL: `${getApiBaseUrl()}/admin`,
  UPLOAD_BASE_URL: `${getApiBaseUrl()}/upload`,
};

console.log("🔧 API Configuration:", {
  environment: import.meta.env.MODE,
  baseUrl: API_CONFIG.BASE_URL,
  isDevelopment: import.meta.env.DEV,
});
