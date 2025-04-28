import api from "./api"

export const DeliveryService = {
  async getDeliveryById(id) {
    try {
      const response = await api.get(`/deliveries/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async getDeliveriesByOrder(orderId) {
    try {
      const response = await api.get(`/deliveries/order/${orderId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async getDeliveriesByLogistician(logisticianId) {
    try {
      const response = await api.get(`/deliveries/logistician/${logisticianId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async updateDeliveryStatus(id, statusData) {
    try {
      const response = await api.patch(`/deliveries/${id}/status`, statusData)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async assignLogistician(id, logisticianId) {
    try {
      const response = await api.patch(`/deliveries/${id}/assign`, { logistician_id: logisticianId })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}

export default DeliveryService