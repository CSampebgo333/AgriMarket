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

interface RegisterData {
  user_name: string;
  email: string;
  password: string;
  user_type: string;
  phone_number: string;
  country: string;
}

interface SellerProfile {
  store_name: string;
  store_description: string;
  store_banner: string;
  store_logo: string;
  store_location: string;
  store_country: string;
  store_city: string;
  store_address: string;
  store_hours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  shipping_policy: string;
  return_policy: string;
}

interface SellerSettings {
  id: number;
  seller_id: number;
  notification_preferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  order_notifications: boolean;
  review_notifications: boolean;
  marketing_emails: boolean;
  created_at: string;
  updated_at: string;
}

// interface Product {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   category_id: number;
//   seller_id: number;
//   images: string[];
//   stock: number;
//   created_at: string;
//   updated_at: string;
// }

interface ProductFilters {
  sort_by?: string;
  sort_order?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  country_of_origin?: string;
  search?: string;
  page?: number;
  limit?: number;
  seller_id?: number;
  exclude_id?: string;
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
  register: async (userData: RegisterData) => {
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
    const response = await api.get('/api/sellers/profile');
    return response.data;
  },
  updateProfile: async (profileData: SellerProfile) => {
    const response = await api.put('/api/sellers/profile', profileData);
    return response.data;
  },
  uploadProfileImage: async (formData: FormData) => {
    const response = await api.post('/api/sellers/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getSettings: async () => {
    const response = await api.get('/api/sellers/settings');
    return response.data;
  },
  updateSettings: async (settingsData: SellerSettings) => {
    const response = await api.put('/api/sellers/settings', settingsData);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/api/sellers/stats');
    return response.data;
  },
};

// Product service
export const productService = {
  getAll: async (params: ProductFilters) => {
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
  create: async (productData: FormData) => {
    const response = await api.post('/api/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  update: async (id: number, productData: FormData) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };
      
      const response = await api.put(`/api/products/${id}`, productData, config);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          message: error.message,
          config: error.config
        });
      }
      throw error;
    }
  },
  delete: async (id: number) => {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  },
  getProducts: async (filters: ProductFilters) => {
    const response = await api.get('/api/products', { params: filters });
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
    const response = await api.get('/api/orders');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },
  create: async (orderData: FormData) => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  },
  update: async (id: number, orderData: { [key: string]: string | number | boolean }) => {
    const response = await api.put(`/api/orders/${id}`, orderData);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/api/orders/${id}`);
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
  create: async (paymentData: PaymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },
  update: async (id: number, paymentData: PaymentData) => {
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
  create: async (deliveryData: DeliveryData) => {
    const response = await api.post('/deliveries', deliveryData);
    return response.data;
  },
  update: async (id: number, deliveryData: DeliveryData) => {
    const response = await api.put(`/deliveries/${id}`, deliveryData);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/deliveries/${id}`);
    return response.data;
  },
};

export const customerService = {
  getProfile: async () => {
    const response = await api.get("/api/customers/profile")
    return response.data
  },
  updateProfile: async (profileData: CustomerProfile) => {
    const response = await api.put("/api/customers/profile", profileData)
    return response.data
  },
  uploadProfileImage: async (formData: FormData) => {
    const response = await api.post("/api/customers/profile/image", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}

interface CustomerProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string;
}

interface PaymentData {
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  order_id: number;
  customer_id: number;
}

interface DeliveryData {
  order_id: number;
  status: string;
  tracking_number: string;
  carrier: string;
  estimated_delivery: string;
  actual_delivery?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
}

export default api; 