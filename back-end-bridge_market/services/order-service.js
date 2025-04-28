import api from "./api"

export const OrderService = {
  async getAllOrders(params = {}) {
    try {
      const response = await api.get("/orders", { params })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async getOrderById(id) {
    try {
      const response = await api.get(`/orders/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async getOrdersByCustomer(customerId, params = {}) {
    try {
      const response = await api.get(`/orders/customer/${customerId}`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async createOrder(orderData) {
    try {
      const response = await api.post("/orders", orderData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async updateOrderStatus(id, status) {
    try {
      const response = await api.patch(`/orders/${id}/status`, { status })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}

export default OrderService