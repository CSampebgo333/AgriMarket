import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://agrimarket-1.onrender.com/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Get token from cookie
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Remove token cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
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
    const response = await api.post('/auth/login', credentials);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (userData: RegisterData) => {
    const response = await api.post('/auth/register', userData);
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
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData: UserProfile) => api.put('/auth/me', profileData),
};

// Seller service
export const sellerService = {
  getProfile: async () => {
    const response = await api.get('/sellers/profile');
    return response.data;
  },
  updateProfile: async (profileData: SellerProfile) => {
    const response = await api.put('/sellers/profile', profileData);
    return response.data;
  },
  uploadProfileImage: async (formData: FormData) => {
    const response = await api.post('/sellers/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getSettings: async () => {
    const response = await api.get('/sellers/settings');
    return response.data;
  },
  updateSettings: async (settingsData: SellerSettings) => {
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
  getAll: async (params: ProductFilters) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  getById: async (id: number) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },
  getByCategory: async (categoryId: number) => {
    try {
      const response = await api.get(`/products/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  },
  create: async (productData: FormData) => {
    try {
      const response = await api.post('/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  update: async (id: number, productData: FormData) => {
    try {
      const response = await api.put(`/products/${id}`, productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },
  delete: async (id: number) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
  getProducts: async (filters: ProductFilters) => {
    try {
      const response = await api.get('/products', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching products with filters:', error);
      throw error;
    }
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
  create: async (orderData: FormData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  update: async (id: number, orderData: { [key: string]: string | number | boolean }) => {
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
    const response = await api.get("/customers/profile")
    return response.data
  },
  updateProfile: async (profileData: CustomerProfile) => {
    const response = await api.put("/customers/profile", profileData)
    return response.data
  },
  uploadProfileImage: async (formData: FormData) => {
    const response = await api.post("/customers/profile/image", formData, {
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