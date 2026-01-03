import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:3000", // environment variable
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (e.g., add token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (e.g., global error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 globally - logout user
    if (error.response?.status === 401) {
      localStorage.removeItem("jwt");
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
