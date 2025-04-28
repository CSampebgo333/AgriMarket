import api from "./api"

export const ProductService = {
  async getAllProducts(params = {}) {
    try {
      const response = await api.get("/products", { params })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async getProductById(id) {
    try {
      const response = await api.get(`/products/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async getProductsByCategory(categoryId, params = {}) {
    try {
      const response = await api.get(`/categories/${categoryId}/products`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async getProductsBySeller(sellerId, params = {}) {
    try {
      const response = await api.get(`/products/seller/${sellerId}`, { params })
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async createProduct(productData) {
    try {
      // Create FormData for file upload if there's an image
      let requestData = productData
      let config = {}

      if (productData.image instanceof File) {
        const formData = new FormData()
        Object.keys(productData).forEach((key) => {
          if (key === "image") {
            formData.append("image", productData.image)
          } else {
            formData.append(key, productData[key])
          }
        })
        requestData = formData
        config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      }

      const response = await api.post("/products", requestData, config)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async updateProduct(id, productData) {
    try {
      // Create FormData for file upload if there's an image
      let requestData = productData
      let config = {}

      if (productData.image instanceof File) {
        const formData = new FormData()
        Object.keys(productData).forEach((key) => {
          if (key === "image") {
            formData.append("image", productData.image)
          } else {
            formData.append(key, productData[key])
          }
        })
        requestData = formData
        config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      }

      const response = await api.put(`/products/${id}`, requestData, config)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  async deleteProduct(id) {
    try {
      const response = await api.delete(`/products/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}

export default ProductService