import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('adminToken');
      delete api.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  logout: () => api.post('/admin/logout'),
  getProfile: () => api.get('/admin/profile'),
};

export const deviceAPI = {
  getUnverified: (params) => api.get('/devices/unverified', { params }),
  verifyDevice: (userId) => api.patch(`/devices/verify/${userId}`),
  verifyBatch: (userIds) => api.patch('/devices/verify-batch', { userIds }),
  getStats: () => api.get('/devices/stats'),
};

export const customerAPI = {
  getCustomers: (params) => api.get('/customers', { params }),
  getCustomer: (userId) => api.get(`/customers/${userId}`),
  getCustomerTransactions: (userId, params) => api.get(`/customers/${userId}/transactions`, { params }),
  getCustomerBalance: (userId) => api.get(`/customers/${userId}/balance`),
  getStats: () => api.get('/customers/stats'),
};

export const analyticsAPI = {
  getDashboard: (params) => api.get('/analytics/dashboard', { params }),
  getTransactions: (params) => api.get('/analytics/transactions', { params }),
  getCustomers: () => api.get('/analytics/customers'),
};

export default api;
