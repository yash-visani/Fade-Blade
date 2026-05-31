import axios from 'axios';

const api = axios.create({
  // Pointing directly to your live Render backend
  baseURL: 'https://fade-blade-backend.onrender.com/api', 
});

// This automatically attaches your login token to every request
api.interceptors.request.use((config) => {
  try {
    // We wrap this in a try-catch so strict mobile browsers don't crash the app
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn("Mobile browser blocked localStorage access:", error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;