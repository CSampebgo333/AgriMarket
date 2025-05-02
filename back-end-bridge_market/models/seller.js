const db = require("../lib/db")

class SellerModel {
  // Get seller by ID
  static async getById(sellerId) {
    return db.getOne("SELECT * FROM sellers WHERE user_id = ?", [sellerId])
  }

  // Get seller by user ID
  static async getByUserId(userId) {
    return db.getOne("SELECT * FROM sellers WHERE user_id = ?", [userId])
  }

  // Create a new seller
  static async create(sellerData) {
    const connection = await db.beginTransaction()

    try {
      // First verify the user exists and is a seller
      const user = await db.getOne("SELECT * FROM users WHERE user_id = ? AND user_type = 'Seller'", [sellerData.user_id])
      
      if (!user) {
        throw new Error("User not found or is not a seller.")
      }

      // Insert seller data
      const sellerId = await db.insert("sellers", {
        user_id: sellerData.user_id,
        business_name: sellerData.business_name,
        business_license: sellerData.business_license,
        address: sellerData.address,
        preferred_payment_method: sellerData.preferred_payment_method,
        description: sellerData.description,
        verified: sellerData.verified || false
      })

      await db.commitTransaction(connection)
      return await this.getById(sellerId)
    } catch (error) {
      await db.rollbackTransaction(connection)
      throw error
    }
  }

  // Update seller
  static async update(sellerId, updateData) {
    const connection = await db.beginTransaction()

    try {
      // Verify seller exists
      const seller = await this.getById(sellerId)
      if (!seller) {
        throw new Error("Seller not found.")
      }

      // Update seller data
      const fields = {}
      if (updateData.business_name) fields.business_name = updateData.business_name
      if (updateData.business_license) fields.business_license = updateData.business_license
      if (updateData.address) fields.address = updateData.address
      if (updateData.preferred_payment_method) fields.preferred_payment_method = updateData.preferred_payment_method
      if (updateData.description) fields.description = updateData.description
      if (updateData.verified !== undefined) fields.verified = updateData.verified

      if (Object.keys(fields).length > 0) {
        await db.update("sellers", fields, { user_id: sellerId })
      }

      await db.commitTransaction(connection)
      return await this.getById(sellerId)
    } catch (error) {
      await db.rollbackTransaction(connection)
      throw error
    }
  }

  // Delete seller
  static async delete(sellerId) {
    return db.remove("sellers", { user_id: sellerId })
  }

  // Get all sellers with pagination and filters
  static async getAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit
    let query = `
      SELECT s.*, u.user_name, u.email, u.phone_number, u.country, u.profile_image
      FROM sellers s
      JOIN users u ON s.user_id = u.user_id
    `
    const params = []

    if (Object.keys(filters).length > 0) {
      const conditions = []
      for (const [key, value] of Object.entries(filters)) {
        conditions.push(`s.${key} = ?`)
        params.push(value)
      }
      query += " WHERE " + conditions.join(" AND ")
    }

    query += " LIMIT ? OFFSET ?"
    params.push(limit, offset)

    return db.query(query, params)
  }
}

module.exports = SellerModel