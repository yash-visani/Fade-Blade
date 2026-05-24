import axios from 'axios';

const api = axios.create({
  // Pointing directly to your live Render backend
  baseURL: 'https://fade-blade-backend.onrender.com/api', 
});

// This automatically attaches your login token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;