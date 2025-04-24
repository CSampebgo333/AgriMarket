import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
  // Add other profile fields as needed
}

interface LoginCredentials {
  email: string;
  password: string;
}

// Auth service
export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/api/auth/login', credentials);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/api/auth/register', userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  getProfile: () => api.get('/api/auth/me'),
  updateProfile: (profileData: UserProfile) => api.put('/api/auth/me', profileData),
};

// Seller service
export const sellerService = {
  getProfile: async () => {
    const response = await api.get('/sellers/profile');
    return response.data;
  },
  updateProfile: async (profileData: any) => {
    const response = await api.put('/sellers/profile', profileData);
    return response.data;
  },
  getSettings: async () => {
    const response = await api.get('/sellers/settings');
    return response.data;
  },
  updateSettings: async (settingsData: any) => {
    const response = await api.put('/sellers/settings', settingsData);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/sellers/stats');
    return response.data;
  },
};

// Product service
export const productService = {
  getAll: async (params: any) => {
    const response = await api.get('/api/products', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },
  getByCategory: async (categoryId: number) => {
    const response = await api.get(`/api/products/category/${categoryId}`);
    return response.data;
  },
  create: async (productData: any) => {
    const response = await api.post('/api/products', productData);
    return response.data;
  },
  update: async (id: number, productData: any) => {
    const response = await api.put(`/api/products/${id}`, productData);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  },
  getProducts: async (filters: any) => {
    const response = await api.get('/api/products/browse', { params: filters });
    return response.data;
  },
};

// Category service
export const categoryService = {
  getAll: () => api.get('/categories'),
  getById: (id: number) => api.get(`/categories/${id}`),
};

// Order service
export const orderService = {
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  create: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  update: async (id: number, orderData: any) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};

// Payment service
export const paymentService = {
  getAll: async () => {
    const response = await api.get('/payments');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
  create: async (paymentData: any) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },
  update: async (id: number, paymentData: any) => {
    const response = await api.put(`/payments/${id}`, paymentData);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },
};

// Delivery service
export const deliveryService = {
  getAll: async () => {
    const response = await api.get('/deliveries');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/deliveries/${id}`);
    return response.data;
  },
  create: async (deliveryData: any) => {
    const response = await api.post('/deliveries', deliveryData);
    return response.data;
  },
  update: async (id: number, deliveryData: any) => {
    const response = await api.put(`/deliveries/${id}`, deliveryData);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/deliveries/${id}`);
    return response.data;
  },
};

export default api; 