import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Auto attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('travel_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;