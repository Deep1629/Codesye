// API configuration for different environments
const getApiUrl = () => {
  // In development, use localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }
  
  // In production, use environment variable or fallback
  return import.meta.env.VITE_API_URL || 'https://your-render-backend.onrender.com';
};

export const API_BASE_URL = getApiUrl();

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  DEMO_LOGIN: '/api/auth/demo-login',
  
  // Code review endpoints
  ANALYZE_CODE: '/api/code/analyze',
  GET_PROGRESS: '/api/user/progress',
  
  // Health check
  HEALTH: '/api/health'
};

export const getApiEndpoint = (endpoint) => `${API_BASE_URL}${endpoint}`; 