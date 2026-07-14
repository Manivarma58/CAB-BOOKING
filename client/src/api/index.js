import axios from 'axios';
import toast from 'react-hot-toast';

// Base API instantiation
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 15000
});

// Request Interceptor: Attach JWT bearer token from LocalStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle HTTP failures globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
    
    // Check for authorization expiry
    if (error.response?.status === 401) {
      const isAuthPage = window.location.pathname.includes('/login') || 
                         window.location.pathname.includes('/register') ||
                         window.location.pathname === '/';
                         
      if (!isAuthPage) {
        toast.error('Session expired. Logging out.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else {
      toast.error(errorMessage);
    }
    return Promise.reject(error);
  }
);

// Unified API service requests
export const userAPI = {
  login: (data) => API.post('/users/login', data),
  register: (formData) => API.post('/users/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getProfile: () => API.get('/users/profile'),
  updateProfile: (formData) => API.put('/users/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export const adminAPI = {
  login: (data) => API.post('/admin/login', data),
  register: (data) => API.post('/admin/register', data),
  getDashboardStats: () => API.get('/admin/dashboard'),
  getUsers: () => API.get('/admin/users'),
  getBookings: () => API.get('/admin/bookings'),
  getCars: () => API.get('/admin/cars')
};

export const carAPI = {
  getAll: (params) => API.get('/cars', { params }),
  getAvailable: () => API.get('/cars/available'),
  search: (q) => API.get('/cars/search', { params: { q } }),
  getById: (id) => API.get(`/cars/${id}`),
  add: (formData) => API.post('/cars', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => API.put(`/cars/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => API.delete(`/cars/${id}`)
};

export const bookingAPI = {
  calculateFare: (data) => API.post('/bookings/calculate-fare', data),
  bookCab: (data) => API.post('/bookings', data),
  getUserBookings: () => API.get('/bookings'),
  getById: (id) => API.get(`/bookings/${id}`),
  updateStatus: (id, status) => API.put(`/bookings/${id}`, { status }),
  cancel: (id) => API.put(`/bookings/${id}/cancel`),
  getAdminBookings: () => API.get('/bookings/admin')
};

export const paymentAPI = {
  createSession: (bookingId) => API.post('/payments/create-session', { bookingId }),
  verify: (data) => API.post('/payments/verify', data)
};

export default API;
