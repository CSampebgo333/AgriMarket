import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Product service
export const productService = {
  // Get all products
  async getAll(params = {}) {
    const response = await api.get("/products", { params })
    return response.data
  },

  // Get product by ID
  async getById(id) {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  // Create product
  async create(productData) {
    const response = await api.post("/products", productData)
    return response.data
  },

  // Update product
  async update(id, productData) {
    const response = await api.put(`/products/${id}`, productData)
    return response.data
  },

  // Delete product
  async delete(id) {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  // Get related products
  async getRelated(id, limit = 4) {
    const response = await api.get(`/products/${id}/related`, { params: { limit } })
    return response.data
  },

  // Add review
  async addReview(productId, reviewData) {
    const response = await api.post(`/products/${productId}/reviews`, reviewData)
    return response.data
  },

  // Get reviews
  async getReviews(productId, page = 1, limit = 10) {
    const response = await api.get(`/products/${productId}/reviews`, { params: { page, limit } })
    return response.data
  },

  // Browse products (public)
  async browse(params = {}) {
    const response = await api.get("/products/browse", { params })
    return response.data
  },
}

// Order service
export const orderService = {
  // Get all orders
  async getAll() {
    const response = await api.get("/orders")
    return response.data
  },

  // Get order by ID
  async getById(id) {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  // Create order
  async create(orderData) {
    const response = await api.post("/orders", orderData)
    return response.data
  },

  // Update order status
  async updateStatus(id, status) {
    const response = await api.put(`/orders/${id}/status`, { status })
    return response.data
  },

  // Update order
  async update(id, orderData) {
    const response = await api.put(`/orders/${id}`, orderData)
    return response.data
  },
}

// Seller service
export const sellerService = {
  // Get seller profile
  async getProfile() {
    const response = await api.get("/sellers/profile")
    return response.data
  },

  // Update seller profile
  async updateProfile(profileData) {
    const response = await api.put("/sellers/profile", profileData)
    return response.data
  },

  // Get store profile
  async getStoreProfile() {
    const response = await api.get("/sellers/store")
    return response.data
  },

  // Update store profile
  async updateStoreProfile(storeData) {
    const response = await api.put("/sellers/store", storeData)
    return response.data
  },

  // Get seller settings
  async getSettings() {
    const response = await api.get("/sellers/settings")
    return response.data
  },

  // Update seller settings
  async updateSettings(settingsData) {
    const response = await api.put("/sellers/settings", settingsData)
    return response.data
  },

  // Get seller statistics
  async getStats(params = {}) {
    const response = await api.get("/sellers/stats", { params })
    return response.data
  },
}

// Auth service
export const authService = {
  // Register
  async register(userData) {
    const response = await api.post("/auth/register", userData)
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
    }
    return response.data
  },

  // Login
  async login(credentials) {
    const response = await api.post("/auth/login", credentials)
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
    }
    return response.data
  },

  // Logout
  logout() {
    localStorage.removeItem("token")
    return { success: true }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get("/auth/me")
      return response.data
    } catch (error) {
      localStorage.removeItem("token")
      throw error
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem("token")
  },
}

export default {
  productService,
  orderService,
  sellerService,
  authService,
}