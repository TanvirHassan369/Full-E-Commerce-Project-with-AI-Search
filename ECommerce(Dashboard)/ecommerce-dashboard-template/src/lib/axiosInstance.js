import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api/v1',
  withCredentials: true,
});
