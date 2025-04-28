import api from "./api"

export const PaymentService = {
  async createPayment(paymentData) {
    try {
      const response = await api.post("/payments", paymentData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async getPaymentById(id) {
    try {
      const response = await api.get(`/payments/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async getPaymentsByOrder(orderId) {
    try {
      const response = await api.get(`/payments/order/${orderId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async getPaymentsByCustomer(customerId) {
    try {
      const response = await api.get(`/payments/customer/${customerId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async updatePaymentStatus(id, data) {
    try {
      const response = await api.patch(`/payments/${id}`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}

export default PaymentService