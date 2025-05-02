const db = require("../lib/db")
const bcryptjs = require("bcryptjs")

class UserModel {
  // Get user by ID
  static async getById(userId) {
    return db.getOne("SELECT * FROM users WHERE user_id = ?", [userId])
  }

  // Get user by email
  static async getByEmail(email) {
    return db.getOne("SELECT * FROM users WHERE email = ?", [email])
  }

  // Create a new user
  static async create(userData) {
    // Hash the password
    const hashedPassword = await bcryptjs.hash(userData.password, 10)

    // Start a transaction
    const connection = await db.beginTransaction()

    try {
      // Insert into users table
      const userId = await db.insert("users", {
        user_name: userData.user_name,
        email: userData.email,
        password: hashedPassword,
        phone_number: userData.phone_number,
        country: userData.country,
        user_type: userData.user_type,
        profile_image: userData.profile_image || null,
        is_verified: userData.is_verified || false,
      })

      // Insert into the appropriate specialized table based on user_type
      switch (userData.user_type) {
        case "Seller":
          await db.insert("sellers", {
            user_id: userId,
            business_name: userData.business_name,
            business_license: userData.business_license,
            address: userData.address,
            preferred_payment_method: userData.preferred_payment_method,
          })
          break
        case "Customer":
          await db.insert("customers", {
            user_id: userId,
            address: userData.address,
            location: userData.location,
            preferred_payment_method: userData.preferred_payment_method,
          })
          break
        case "Admin":
          await db.insert("administrators", {
            user_id: userId,
            admin_level: userData.admin_level,
            permissions: userData.permissions ? JSON.stringify(userData.permissions) : null,
          })
          break
        case "Logistician":
          await db.insert("logisticians", {
            user_id: userId,
            availability_status: userData.availability_status || true,
            location: userData.location,
            transport_type: userData.transport_type,
            capacity: userData.capacity,
          })
          break
      }

      // Commit the transaction
      await db.commitTransaction(connection)

      return userId
    } catch (error) {
      // Rollback the transaction in case of error
      await db.rollbackTransaction(connection)
      throw error
    }
  }

  // Update user
  static async update(userId, userData) {
    const connection = await db.beginTransaction()

    try {
      // Update users table
      const userFields = {}

      if (userData.user_name) userFields.user_name = userData.user_name
      if (userData.phone_number) userFields.phone_number = userData.phone_number
      if (userData.country) userFields.country = userData.country
      if (userData.profile_image) userFields.profile_image = userData.profile_image
      if (userData.is_verified !== undefined) userFields.is_verified = userData.is_verified

      // Only update password if provided
      if (userData.password) {
        userFields.password = await bcryptjs.hash(userData.password, 10)
      }

      if (Object.keys(userFields).length > 0) {
        await db.update("users", userFields, { user_id: userId })
      }

      // Update specialized table based on user_type
      const user = await this.getById(userId)

      if (user) {
        switch (user.user_type) {
          case "Seller":
            const sellerFields = {}
            if (userData.business_name) sellerFields.business_name = userData.business_name
            if (userData.business_license) sellerFields.business_license = userData.business_license
            if (userData.address) sellerFields.address = userData.address
            if (userData.preferred_payment_method)
              sellerFields.preferred_payment_method = userData.preferred_payment_method
            if (userData.description) sellerFields.description = userData.description
            if (userData.verified !== undefined) sellerFields.verified = userData.verified

            if (Object.keys(sellerFields).length > 0) {
              await db.update("sellers", sellerFields, { user_id: userId })
            }
            break

          case "Customer":
            const customerFields = {}
            if (userData.address) customerFields.address = userData.address
            if (userData.location) customerFields.location = userData.location
            if (userData.preferred_payment_method)
              customerFields.preferred_payment_method = userData.preferred_payment_method

            if (Object.keys(customerFields).length > 0) {
              await db.update("customers", customerFields, { user_id: userId })
            }
            break

          case "Admin":
            const adminFields = {}
            if (userData.admin_level) adminFields.admin_level = userData.admin_level
            if (userData.permissions) adminFields.permissions = JSON.stringify(userData.permissions)

            if (Object.keys(adminFields).length > 0) {
              await db.update("administrators", adminFields, { user_id: userId })
            }
            break

          case "Logistician":
            const logisticianFields = {}
            if (userData.availability_status !== undefined)
              logisticianFields.availability_status = userData.availability_status
            if (userData.location) logisticianFields.location = userData.location
            if (userData.transport_type) logisticianFields.transport_type = userData.transport_type
            if (userData.capacity) logisticianFields.capacity = userData.capacity

            if (Object.keys(logisticianFields).length > 0) {
              await db.update("logisticians", logisticianFields, { user_id: userId })
            }
            break
        }
      }

      await db.commitTransaction(connection)
      return await this.getById(userId)
    } catch (error) {
      await db.rollbackTransaction(connection)
      throw error
    }
  }

  // Delete user
  static async delete(userId) {
    return db.remove("users", { user_id: userId })
  }

  // Get all users with pagination and filters
  static async getAll(page = 1, limit = 10, filters = {}) {
    const offset = (page - 1) * limit
    let query = "SELECT * FROM users"
    const params = []

    if (Object.keys(filters).length > 0) {
      const conditions = []
      for (const [key, value] of Object.entries(filters)) {
        conditions.push(`${key} = ?`)
        params.push(value)
      }
      query += " WHERE " + conditions.join(" AND ")
    }

    query += " LIMIT ? OFFSET ?"
    params.push(limit, offset)

    return db.query(query, params)
  }

  // Get full user details including specialized data
  static async getFullDetails(userId) {
    const user = await this.getById(userId)
    if (!user) return null

    let specializedData = null

    switch (user.user_type) {
      case "Seller":
        specializedData = await db.getOne("SELECT * FROM sellers WHERE user_id = ?", [userId])
        break
      case "Customer":
        specializedData = await db.getOne("SELECT * FROM customers WHERE user_id = ?", [userId])
        break
      case "Admin":
        specializedData = await db.getOne("SELECT * FROM administrators WHERE user_id = ?", [userId])
        break
      case "Logistician":
        specializedData = await db.getOne("SELECT * FROM logisticians WHERE user_id = ?", [userId])
        break
    }

    return {
      ...user,
      specialized_data: specializedData,
    }
  }

  // Verify password
  static async verifyPassword(user, password) {
    return bcryptjs.compare(password, user.password)
  }
}

module.exports = UserModel