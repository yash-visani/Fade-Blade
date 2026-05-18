import axios from 'axios';

// Create an instance of axios with our backend URL
const api = axios.create({
  baseURL: 'https://fade-blade-backend.onrender.com/api', // Matches your backend port
});

// Intercept requests to attach the auth token if it exists in local storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;