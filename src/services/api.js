import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Aquí podrías agregar tokens de autenticación si fuera necesario
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Error en la petición';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

// ==================== PRODUCTOS ====================
export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  search: (query) => api.get(`/products/search?q=${query}`),
  getLowStock: () => api.get('/products/low-stock'),
  getMovements: (id) => api.get(`/products/${id}/movements`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  updateStock: (id, data) => api.patch(`/products/${id}/stock`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// ==================== VENTAS ====================
export const saleAPI = {
  getAll: (limit) => api.get(`/sales${limit ? `?limit=${limit}` : ''}`),
  getById: (id) => api.get(`/sales/${id}`),
  getByDateRange: (startDate, endDate) => 
    api.get(`/sales/date-range?start_date=${startDate}&end_date=${endDate}`),
  getReport: (startDate, endDate) => 
    api.get(`/sales/report?start_date=${startDate}&end_date=${endDate}`),
  getStats: () => api.get('/sales/stats'),
  getTopProducts: (limit = 10) => api.get(`/sales/top-products?limit=${limit}`),
  create: (data) => api.post('/sales', data),
  cancel: (id) => api.patch(`/sales/${id}/cancel`),
};

// ==================== CLIENTES ====================
export const customerAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  search: (query) => api.get(`/customers/search?q=${query}`),
  getVIP: () => api.get('/customers/vip'),
  getHistory: (id) => api.get(`/customers/${id}/history`),
  getStats: (id) => api.get(`/customers/${id}/stats`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// ==================== ALERTAS ====================
export const alertAPI = {
  getAll: () => api.get('/alerts'),
  getActive: () => api.get('/alerts/active'),
  getById: (id) => api.get(`/alerts/${id}`),
  getStats: () => api.get('/alerts/stats'),
  create: (data) => api.post('/alerts', data),
  resolve: (id) => api.patch(`/alerts/${id}/resolve`),
  delete: (id) => api.delete(`/alerts/${id}`),
};

// ==================== UBICACIONES ====================
export const locationAPI = {
  getAll: () => api.get('/locations'),
  getById: (id) => api.get(`/locations/${id}`),
  search: (query) => api.get(`/locations/search?q=${query}`),
  getByType: (type) => api.get(`/locations/type/${type}`),
  getNearby: (latitude, longitude, radius = 10) => 
    api.get(`/locations/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`),
  getProducts: (id) => api.get(`/locations/${id}/products`),
  getStats: () => api.get('/locations/stats'),
  create: (data) => api.post('/locations', data),
  update: (id, data) => api.put(`/locations/${id}`, data),
  addProduct: (id, data) => api.post(`/locations/${id}/products`, data),
  delete: (id) => api.delete(`/locations/${id}`),
};

// ==================== DASHBOARD ====================
export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
};

export default api;
